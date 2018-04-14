<!--机构持仓-->
<template>
  <div>
    <table-search @submit="searchCompanyPosition">
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
        <el-form-item label="币种">
          <easy-select v-model="formData.base_crncy_type" dict="base_crncy_type" value-type="String"
                       style="width: 100px"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group class="btn-left">
          <el-button size="small" type="primary" @click="searchCompanyPosition" icon="el-icon-refresh">刷新
          </el-button>
        </el-button-group>
      </slot>
      <slot>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="exportCompanyPosition" icon="el-icon-export">数据导出
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
          begin_end: [moment().format("YYYYMMDD"), moment().format("YYYYMMDD")],
          exch_no: ' ',
          base_crncy_type: ' '
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
            title: '初始化日期',
            width: 120
          },
          {
            name: 'co_name',
            title: '机构名称',
            width: 120
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
          }, {
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
    },
    mounted() {
      this.searchCompanyPosition()
    },
    methods: {
      searchCompanyPosition() {
        this.$post('prodL.2.91.json', {
          begin_date: this.formData.begin_end[0],
          end_date: this.formData.begin_end[1],
          base_crncy_type: this.formData.base_crncy_type,
        }).then(resp => {
          this.tableData = resp
        })
      },
      exportCompanyPosition() {
        this.export2Excel()
      },
      export2Excel() {
        const tHeader = ['初始化日期', '机构名称', '交易市场', '币种', '期初数量', '当前数量', '持仓数量', '可用数量', '冻结数量', '解冻数量'];
        const filterVal = ['init_date', 'co_name', 'exch_name', 'base_crncy_type', 'begin_qty', 'curr_qty', 'posi_qty', 'avail_qty', 'frozen_qty', 'unfroz_qty'];
        const list = this.tableData;
        const data = list.map(item => filterVal.map(key => {
          if (key === 'curr_qty' || key === 'begin_qty' || key === 'posi_qty' || key === 'avail_qty' || key === 'frozen_qty' || key === 'unfroz_qty') {
            return format('number', '$0', item[key])
          }
          return item[key]
        }))
        const currentDate = new Date();
        const excelName = '机构持仓' + currentDate.format('yyyyMMdd');
        const excelSheetName = '机构持仓';
        export_json_to_excel(tHeader, data, excelSheetName, excelName);
      }

    }
  }
</script>
<style lang="scss" scoped>
  .el-date-editor {
    width: 100%;
  }
</style>
