<!--业务账号同步-->
<template>
  <div>
    <el-card class="box-card">
      <h3 slot="header" id="table-slot">账户检查</h3>
      <el-form :inline="true" class="search-form-inline">
        <el-form-item label="可同步业务账号">
          <easy-select v-model="syncAssetAccoNo" value-type="Number" style="width: 150px" :data="syncAbleAssets"></easy-select>
        </el-form-item>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" icon="el-icon-refresh" @click="checkSyncHandler">核对</el-button>
        </el-button-group>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <h3 slot="header" id="table-slot">差异比对</h3>
      <table-search @submit="searchDiff" style="border-top: 1px solid #ebebeb">
        <slot>
          <el-form-item label="机构账号名称">
            <easy-select v-model="formData.pd_no" value-type="Number" style="width: 150px" :data="allProducts" ></easy-select>
          </el-form-item>
          <el-form-item label="业务账号名称">
            <easy-select v-model="formData.asset_acco_no" value-type="Number" style="width: 150px" :data="allAssets" ></easy-select>
          </el-form-item>
          <el-form-item label="处理标志">
            <easy-select v-model="formData.deal_flag" value-type="Number" dict="deal_flag" style="width: 100px" ></easy-select>
          </el-form-item>
        </slot>
      </table-search>
      <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}" align="center" headerAlign="center">
        <slot>
          <el-button size="small" type="primary" :disabled="selectedRow === null" @click="syncHandler">处理差异</el-button>
          <el-button size="small" type="primary" @click="allSyncHandler">批量处理</el-button>
          <el-button-group class="btn-right">
            <el-button size="small" type="primary" icon="el-icon-refresh" @click="searchDiff">刷新</el-button>
          </el-button-group>
        </slot>
      </easy-table>
    </el-card>
  </div>
</template>
<script>
import { Button, ButtonGroup, Col, Card, Dialog, DatePicker, Form, FormItem, Input, Row, Select, Table, TableColumn, Tooltip, Option } from 'element-ui'
import { mapGetters, mapState } from 'vuex'
import EasyTable from '@/components/EasyTable'
import EasySelect from '@/components/EasySelect'
import TableSearch from '@/components/TableSearch'
export default {
  components: {
    'el-button': Button,
    'el-button-group': ButtonGroup,
    'el-col': Col,
    'el-card': Card,
    'el-dialog': Dialog,
    'el-date-picker': DatePicker,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-row': Row,
    'el-select': Select,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-tooltip': Tooltip,
    'el-option': Option,
    EasySelect,
    EasyTable,
    TableSearch
  },
  computed: {
  ...mapGetters('dict', ['getDictByName']),
  ...mapState('login', {
      user: state => state.user
    }),
  ...mapState('cache', {
      allProducts: state => state.products,
      allChannels: state => state.channels,
      allAssets: state => state.assets,
      allExchGroups: state => state.exchGroups
    })
  },
  data() {
    return {
      dialogTableVisible: false,
      formData: {
        pd_no: 0,
        asset_acco_no: 0,
        deal_flag: 0
      },
      syncAssetAccoNo: 0,
      syncAbleAssets: [],
      tableData: [],
      tableColumns: [{
        name: 'pd_name',
        title: '机构账户名称'
      }, {
        name: 'asset_acco_name',
        title: '业务账号名称'
      }, {
        name: 'exch_group_name',
        title: '交易账户名称'
      }, {
        name: 'exch_no',
        title: '交易市场',
        formatter (row, column, cellValue) {
          return this.translateDict('exch_no', cellValue)
        }
      }, {
        name: 'base_crncy_type',
        title: '基础币种'
      }, {
        name: 'acco_posi_qty',
        title: '业务账户持仓'
      }, {
        name: 'out_posi_qty',
        title: '外部持仓'
      }, {
        name: 'acco_posi_qty_diff',
        title: '持仓数量差额'
      }, {
        name: 'deal_flag',
        title: '处理标志',
        formatter(row, column, cellValue) {
          return this.translateDict('deal_flag', cellValue)
        }
      }],
      selectedRow: null
    }
  },
  mounted () {
    this.searchSyncAssetAccountInfo()
    this.searchDiff()
  },
  methods: {
    searchSyncAssetAccountInfo() {
      this.$post('prodL.1.54.json', {
        pd_no: 0,
        asset_acco_no: 0
      }).then(resp => {
        this.syncAbleAssets = resp.map(item=>{
          return {
            label: item.asset_acco + '- ' +item.asset_acco_name,
            value: item.asset_acco_no
          }
        })
      })
    },
    searchDiff() {
      this.$post('prodL.2.204.json', {
        pd_no: this.formData.pd_no,
        asset_acco_no: this.formData.asset_acco_no,
        deal_flag: this.formData.deal_flag,
        row_count: -1
      }).then(resp =>{
        this.tableData = resp
      })
    },
    checkSyncHandler() {
      this.$post('checkassetL.01.01.json', {
        asset_acco_no: this.syncAssetAccoNo,
      }).then(resp=>{
        this.searchDiff()
      })
    },
    allSyncHandler() {
    },
    syncHandler() {
      this.$post('prodL.2.205.json', {
        row_id: this.selectedRow.row_id
      }).then(resp => {
        this.$message.alert('处理成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .box-card{
    border-top: none;
  }
  /deep/ .el-dialog__body {
    padding: 0 0 20px 0;
  }
  /deep/ .el-card__header {
    padding: 10px 20px;
  }
</style>
