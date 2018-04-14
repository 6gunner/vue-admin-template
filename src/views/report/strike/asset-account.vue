<!--业务账户成交-->
<template>
  <div>
    <table-search @submit="searchAssetsAccountStrike">
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
        <el-form-item label="业务账户名称">
          <easy-select v-model="formData.asset_acco_no"  value-type="Number" :data="allAssets"
                       style="width: 150px"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group class="btn-left">
          <el-button size="small" type="primary" @click="searchAssetsAccountStrike" icon="el-icon-refresh">刷新
          </el-button>
        </el-button-group>
      </slot>
      <slot>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="exportAssetsAccountStrike" icon="el-icon-export">数据导出
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
          begin_end: [moment().format('YYYYMMDD'), moment().format('YYYYMMDD')],
          pd_no: 0,
          asset_acco_no: 0
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
            name: 'row_id',
            title: '成交序号',
            width: 120
          },{
            name: 'create_date',
            title: '成交时间',
            width: 160,
            formatter (row, column, cellValue) {
              return format('datetime', 'yyyy-MM-dd hh:mm:ss', row.strike_date+' '+row.strike_time)
            }
          },
          {
            name: 'co_name',
            title: '机构名称',
            width: 120
          },
          {
            name: 'pd_name',
            title: '机构账户名称',
            width: 120
          }, {
            name: 'asset_acco_name',
            title: '业务账户名称',
            width: 120
          },
          {
            name: 'exch_no',
            title: '交易市场',
            formatter(row, column, cellValue) {
              return this.translateDict('exch_no', cellValue)
            }
          }, {
            name: 'stock_name',
            title: '币对名称'
          }, {
            name: 'order_dir',
            title: '订单方向'
          }, {
            name: 'strike_price',
            title: '成交价格'
          }, {
            name: 'bs_crncy_strike_qty',
            title: '成交数量'

          }, {
            name: 'qt_crncy_strike_qty',
            title: '成交额'
          },{
            name: 'strike_fee',
            title: '成交费用'
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
      ...mapGetters('dict', ['getDictByName', 'translateDict']),
      ...mapState('login', {
        user: state => state.user
      }),
      ...mapState('cache', {
        allProducts: state => state.products,
        allAssets: state => state.assets
      }),
    },
    mounted() {
      this.searchAssetsAccountStrike()
    },
    methods: {
      searchAssetsAccountStrike() {
        this.$post('tdsecuL.5.132.json', {
          begin_date: this.formData.begin_end[0],
          end_date: this.formData.begin_end[1],
          pd_no: this.formData.pd_no,
          asset_acco_no: this.formData.asset_acco_no,
          row_count: -1,
          sort_type:2
        }).then(resp => {
          this.tableData = resp
        })
      },
      exportAssetsAccountStrike() {
        this.export2Excel()
      },
      export2Excel() {
        const tHeader = ['成交序号', '成交时间', '机构名称', '机构账户名称', '业务账户名称', '交易市场', '币对名称', '订单方向', '成交价格', '成交数量', '成交额', '成交费用'];
        const filterVal = ['row_id', 'create_date', 'co_name', 'pd_name', 'asset_acco_name', 'exch_name', 'stock_name', 'order_dir', 'strike_price', 'bs_crncy_strike_qty', 'qt_crncy_strike_qty', 'strike_fee'];
        const list = this.tableData;
        const data = list.map(item => filterVal.map(key => {
          if (key === 'strike_price' || key === 'bs_crncy_strike_qty' || key === 'qt_crncy_strike_qty' || key === 'strike_fee') {
            return format('number', '$0', item[key])
          }
          else if(key === 'order_dir'){
            return this.translateDict(key , item[key])
          }
          else if(key === 'create_date') {
            return format('datetime', 'yyyy-MM-dd hh:mm:ss',  item['strike_date']+' '+item['strike_time'])
          }
          return item[key]
        }))
        const currentDate = new Date();
        const excelName = '业务账户成交' + currentDate.format('yyyyMMdd');
        const excelSheetName = '业务账户成交';
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
