<!--提币记录查询-->
<template>
  <div>
    <table-search @submit="searchRptWithdrawCrny">
      <slot>
        <el-form-item label="">
          <el-date-picker
            v-model="formData.begin_end"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            :picker-options="pickerOptions"
            style="width: 300px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="机构账户名称">
          <easy-select v-model="formData.pd_no" value-type="Number" :data="allProducts"
                       style="width: 150px"></easy-select>
        </el-form-item>
        <el-form-item label="交易账户名称">
          <easy-select v-model="formData.exch_group_no" value-type="Number" :data="allExchGroups"
                       style="width: 150px"></easy-select>
        </el-form-item>
        <el-form-item label="币种">
          <easy-select v-model="formData.base_crncy_type" dict="base_crncy_type" value-type="String"
                       style="width: 100px"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group class="btn-left">
          <el-button size="small" type="primary" @click="searchRptWithdrawCrny" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
  </div>
</template>
<script>
  import {
    Button,
    ButtonGroup,
    Col,
    Dialog,
    DatePicker,
    Form,
    FormItem,
    Input,
    Row,
    Select,
    Tooltip,
    Option
  } from 'element-ui'
  import {mapGetters, mapState} from 'vuex'
  import {format} from '@/tools/index'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import TableSearch from '@/components/TableSearch'
  import {export_json_to_excel} from '@/tools/Export2Excel'

  const moment = require('moment')

  export default {
    data() {
      return {
        formData: {
          pd_no: 0,
          exch_group_no: 0,
          exch_no_str: ' ',
          base_crncy_type: ' ',
          begin_end: [moment().format('YYYYMMDD'), moment().format('YYYYMMDD')]
        },
        pickerOptions: {

          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tableData: [],
        selectedRow: null,
        tableColumns: [
          {
            name: 'wtdraw_time',
            title: '提币时间',
            formatter (row, column, cellValue) {
              return format('datetime', 'yyyy-MM-dd hh:mm:ss', row.wtdraw_crncy_date+' '+row.wtdraw_crncy_time)
            }
          },
          {
            name: 'pd_name',
            title: '机构账户名称'
          }, {
            name: 'asset_acco_name',
            title: '业务账户名称'
          }, {
            name: 'exch_group_name',
            title: '交易账户名称'
          }, {
            name: 'base_crncy_type',
            title: '币种'
          }, {
            name: 'wtdraw_crncy_id',
            title: '提币序号'
          },{
            name: 'report_no',
            title: '申报编号'
          },{
            name: 'wtdraw_crncy_qty',
            title: '提取数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
          },{
            name: 'settle_qty',
            title: '到账数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
          },{
            name: 'wtdraw_crncy_status',
            title: '提币状态',
            formatter(row, column, cellValue) {
              return this.translateDict('wtdraw_crncy_status', cellValue)
            }
          }, {
            name: 'service_fee',
            title: '手续费',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
          }, {
            name: 'wtdraw_crncy_addr',
            title: '提币地址'
          }, {
            name: 'hash_key',
            title: '区块链交易ID'
          },{
            name: 'opor_no',
            title: '操作员编号'
          },
          {
            name: 'opor_name',
            title: '操作员名称'
          },{
            name: 'exch_name',
            title: '交易市场'
          },{
            name: 'rsp_info',
            title: '回报信息'
          }]
      }
    },
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup,
      'el-col': Col,
      'el-dialog': Dialog,
      'el-date-picker': DatePicker,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-row': Row,
      'el-select': Select,
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
        allExchGroups: state => state.exchGroups
      }),
    },
    mounted() {
      this.searchRptWithdrawCrny()
    },
    methods: {
      searchRptWithdrawCrny() {
        this.$post('prodL.2.113.json', {
          begin_date: this.formData.begin_end[0],
          end_date: this.formData.begin_end[1],
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          base_crncy_type: this.formData.base_crncy_type,
        }).then(resp => {
          this.tableData = resp
        })
      },
      pdChangeHandler(newValue) {
        this.$refs.exchGroupSelector.clear()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-date-editor {
    width: 100%;
  }
</style>

