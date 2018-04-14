<!--交易组持仓流水-->
<template>
  <div>
    <table-search @submit="searchExchGroupPositionFlow">
      <slot>
        <el-form-item label="机构账户名称">
          <easy-select v-model="formData.pd_no" value-type="Number" style="width: 150px" :data="allProducts" ></easy-select>
        </el-form-item>
        <el-form-item label="交易账户名称">
          <easy-select v-model="formData.exch_group_no" value-type="Number" style="width: 150px" :data="allExchGroups" ></easy-select>
        </el-form-item>
        <el-form-item label="币种">
          <easy-select v-model="formData.stock_code_no" dict="base_crncy_type" value-type="String" style="width: 100px" ></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group>
          <el-button size="small" type="primary" @click="searchExchGroupPositionFlow" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
  </div>
</template>
<script>
  import { Button, ButtonGroup, Col, Dialog, Form, FormItem, Input, Row, Select, Tooltip, Option } from 'element-ui'
  import { mapGetters, mapState } from 'vuex'
  import { format } from '@/tools/index'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import TableSearch from '@/components/TableSearch'
  export default {
    data () {
      return {
        formData: {
          pd_no: 0,
          pd_status: ' '
        },
        tableData: [],
        selectedRow: null,
        dialogFormVisible: false,
        dialogType: 'add',
        dialogTitle: '',
        dialogFormData: {
        },
        formLabelWidth: '85px',
        tableColumns: [{
          name: 'create_date',
          title: '操作时间',
          width: 160,
          formatter (row, column, cellValue) {
            return format('datetime', 'yyyy-MM-dd hh:mm:ss', row.init_date+' '+row.update_time)
          }
        }, {
          name: 'opor_no',
          title: '操作员编号',
          width: 100
        }, {
          name: 'opor_name',
          title: '操作员名称',
          width: 100
        }, {
          name: 'pd_name',
          title: '机构账户名称'
        }, {
          name: 'asset_acco_name',
          title: '业务账户名称'
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
          name: 'busi_flag',
          title: '业务标志',
          formatter (row, column, cellValue) {
            return this.translateDict('busi_flag', cellValue)
          }
        }, {
          name: 'occur_qty',
          title: '变动数量'
        }, {
          name: 'occur_end_qty',
          title: '变动后数量'
        }, {
          name: 'target_occur_end_qty',
          title: '目标变动后数量'
        }, {
          name: 'jour_occur_field',
          title: '流水变动字段'
        }, {
          name: 'jour_after_occur_info',
          title: '流水后信息'
        }]
      }
    },
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup,
      'el-col': Col,
      'el-dialog': Dialog,
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
        allChannels: state => state.channels,
        allAssets: state => state.assets,
        allExchGroups: state => state.exchGroups,

      }),
      ...mapGetters('cache', ['avaliableProducts', 'avaliableChannels', 'avaliableAssets', 'avaliableExchGroups'])
    },
    mounted () {
      this.searchExchGroupPositionFlow()
    },
    methods: {
      searchExchGroupPositionFlow() {
        this.$post('prodL.2.31.json', {
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          exch_no_str: this.formData.exch_no,
          base_crncy_type: this.formData.base_crncy_type,
          row_count: -1
        }).then(resp => {
          this.tableData = resp
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>

