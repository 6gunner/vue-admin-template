<!--触警流水-->
<template>
  <div>
    <table-search @submit="searchAlarmWaterFlow">
      <slot>
        <el-form-item label=""  >
          <el-date-picker
            v-model="formData.begin_end"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            :picker-options="pickerOptions">
            style="width: 300px"
          </el-date-picker>
        </el-form-item>
        <el-form-item label="机构账户名称">
          <easy-select placeholder="机构账户名称" v-model="formData.pd_no" value-type="Number" style="width: 150px" :data="allProducts" ></easy-select>
        </el-form-item>
        <el-form-item label="交易账户名称">
          <easy-select placeholder="交易账户名称" v-model="formData.exch_group_no" value-type="Number" style="width: 150px" :data="allExchGroups" ></easy-select>
        </el-form-item>

      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData"
                :table-height="computedStyle.height + 'px'"
                @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="searchAlarmWaterFlow" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
  </div>
</template>
<script>
  import { Button, ButtonGroup, Col, Dialog, DatePicker, Form, FormItem, Input, Row, Select, Tooltip, Option } from 'element-ui'
  import { mapGetters, mapState } from 'vuex'
  import { format } from '@/tools/index'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import TableSearch from '@/components/TableSearch'

  const moment = require('moment')
  export default {
    data () {
      return {
        computedStyle: {},
        dialogFormVisible: false,
        dialogType: 'add',
        dialogTitle: '',
        dialogFormData: {
        },
        formData: {
          pd_no: 0,
          exch_group_no: 0,
          begin_end: [moment().subtract(1, 'days').format('YYYYMMDD'), moment().format('YYYYMMDD')]
        },
        formLabelWidth: '85px',
        selectedRow: null,
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
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tableData: [],
        tableColumns: [{
          name: 'create_date',
          title: '触发时间',
          width: 160,
          formatter (row, column, cellValue) {
            return format('datetime', 'yyyy-MM-dd hh:mm:ss', row.create_date+' '+row.create_time)
          }
        }, {
          name: 'pd_name',
          title: '机构账户名称',
          width: 100
        }, {
          name: 'exch_group_name',
          title: '交易账户名称',
          width: 100
        }, {
          name: 'client_risk_rule_id',
          title: '客户风险规则序号',
          width: 100
        }, {
          name: 'stock_code',
          title: '交易币对'
        }, {
          name: 'order_dir',
          title: '订单方向',
          formatter (row, column, cellValue) {
            return this.translateDict('order_dir', cellValue)
          }
        }, {
          name: 'risk_item_name',
          title: '风险条目名称'
        }, {
          name: 'risk_rule_type',
          title: '风险规则类型',
          formatter (row, column, cellValue) {
            return this.translateDict('risk_rule_type', cellValue)
          }
        }, {
          name: 'risk_rule_action',
          title: '风险采取行为',
          formatter (row, column, cellValue) {
            return this.translateDict('risk_rule_action', cellValue)
          }
        }, {
          name: 'remark_info',
          title: '详细信息'
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
        allChannels: state => state.channels,
        allAssets: state => state.assets,
        allExchGroups: state => state.exchGroups,

      }),
      ...mapGetters('cache', ['avaliableProducts', 'avaliableChannels', 'avaliableAssets', 'avaliableExchGroups'])
    },
    mounted () {
      let height = document.querySelector('.el-main').clientHeight
      this.computedStyle = {
        height: height - 45 - 200,
      }
      this.searchAlarmWaterFlow()
    },
    methods: {
      searchAlarmWaterFlow() {
        this.$post('rksecuL.4.34.json', {
          begin_date: this.formData.begin_end[0],
          end_date: this.formData.begin_end[1],
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          risk_rule_action: this.formData.risk_rule_action,
          risk_rule_type: this.formData.risk_rule_type,
          trig_stage_type: this.formData.trig_stage_type,
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

