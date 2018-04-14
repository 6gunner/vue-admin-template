<!--交易组账户持仓-->
<template>
  <div>
    <table-search @submit="searchRptExchGroupPosition">
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
          <el-button size="small" type="primary" @click="searchRptExchGroupPosition" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
      <slot>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="exportTradeAccountPosition" icon="el-icon-export">数据导出
          </el-button>
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
            name: 'init_date',
            title: '初始化日期'
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
            name: 'exch_name',
            title: '交易市场'
          }, {
            name: 'base_crncy_type',
            title: '币种'
          }, {
            name: 'begin_qty',
            title: '期初数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
          },{
            name: 'curr_qty',
            title: '当前数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
          }, {
            name: 'posi_qty',
            title: '持仓数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
          }, {
            name: 'avail_qty',
            title: '可用数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }

          }, {
            name: 'frozen_qty',
            title: '冻结数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
          }, {
            name: 'unfroz_qty',
            title: '解冻数量',
            formatter(row, column, cellValue) {
              return format('number', '$0', cellValue)
            }
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
      this.searchRptExchGroupPosition()
    },
    methods: {
      searchRptExchGroupPosition() {
        this.$post('prodL.2.23.json', {
          begin_date: this.formData.begin_end[0],
          end_date: this.formData.begin_end[1],
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          base_crncy_type: this.formData.base_crncy_type,
        }).then(resp => {
          this.tableData = resp
        })
      },
      exportTradeAccountPosition() {
        this.export2Excel()
      },
      export2Excel() {
        const tHeader = ['初始化日期', '机构账户名称', '业务账户名称', '交易账户名称', '交易市场', '币种', '期初数量', '当前数量', '持仓数量', '可用数量', '冻结数量', '解冻数量'];
        const filterVal = ['init_date', 'pd_name', 'asset_acco_name', 'exch_group_name', 'exch_name', 'base_crncy_type', 'begin_qty', 'curr_qty', 'posi_qty', 'avail_qty', 'frozen_qty', 'unfroz_qty'];
        const list = this.tableData;
        const data = list.map(item => filterVal.map(key => {
          if (key === 'curr_qty' || key === 'begin_qty' || key === 'posi_qty' || key === 'avail_qty' || key === 'frozen_qty' || key === 'unfroz_qty') {
            return format('number', '$0', item[key])
          }
          return item[key]
        }))
        const currentDate = new Date();
        const excelName = '交易账户持仓' + currentDate.format('yyyyMMdd');
        const excelSheetName = '交易账户持仓';
        export_json_to_excel(tHeader, data, excelSheetName, excelName);
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

