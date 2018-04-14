<!--提币管理-->
<template>
  <div class="page-container">
    <el-row type="flex" justify="space-between">
      <el-col style="padding-left: 10px">
        <table-search @submit="queryExchGroupPosi">
          <slot>
            <el-form-item label="机构账户名称">
              <easy-select v-model="formData.pd_no" placeholder="机构账户名称" :data="products"></easy-select>
            </el-form-item>
            <el-form-item label="交易账户名称">
              <easy-select v-model="formData.exch_group_no" placeholder="交易账户名称" :data="exchGroups"></easy-select>
            </el-form-item>
            <el-form-item label="选择币种">
              <easy-select v-model="formData.base_crncy_type" placeholder="选择币种" dict="base_crncy_type" value-type="String"></easy-select>
            </el-form-item>
          </slot>
        </table-search>
        <div class="table-wrapper">
          <easy-table :data="exchGroupPositions" :columns="exchGroupPositionColumns" :table-height="380">
            <slot>
              交易账户持仓: <label v-if="currentExchGroup!=null">{{currentExchGroup.exch_group_name}}</label>
              <el-button-group class="btn-right">
                <el-button type="primary" size="small" @click="queryExchGroupPosi">刷新</el-button>
              </el-button-group>
            </slot>
          </easy-table>
        </div>
        <el-tabs value="first">
          <el-tab-pane label="当前提币记录" name="first" >
            <div class="table-wrapper">
              <easy-table :data="withdrawRecords" :columns="withdrawRecordColumns">
                <slot>
                    <el-button-group class="btn-right">
                      <el-button type="primary" size="small" @click="queryCurrentWithdrawRecords">刷新</el-button>
                    </el-button-group>
                </slot>
              </easy-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="历史提币记录" name="second">
            <div class="table-wrapper">
              <div class="table-tools">
                <el-form :inline="true">
                  <el-form-item label="提币时间:">
                    <el-date-picker
                      v-model="beginEndDate"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyyMMdd"
                      :picker-options="pickerOptions"
                      style="width: 285px">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" @click="queryHistoryWithdrawRecords">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-table
                :data="historyWithdrawRecords"
                height="380">
                <el-table-column label="提币时间" align="center" :formatter="timeFormatter"></el-table-column>
                <el-table-column prop="exch_group_name" label="交易账户名称" align="center"></el-table-column>
                <el-table-column prop="base_crncy_type" label="币种" align="center"></el-table-column>
                <el-table-column prop="wtdraw_crncy_qty" label="提币数量" align="center"></el-table-column>
                <el-table-column prop="wtdraw_crncy_status" label="提币状态" align="center" :formatter="statusFormatter"></el-table-column>
                <el-table-column label="手续费" align="center" prop="service_fee"></el-table-column>
                <el-table-column label="提币地址" align="center" prop="wtdraw_crncy_addr"></el-table-column>
                <el-table-column label="交易市场" align="center" prop="exch_no" :formatter="exchFormatter"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog class="dialog"
               title="提币"
               width="50%"
               append-to-body
               :visible.sync="dialogVisible"
               :lock-scroll="false">
      <el-form :model="dialogFormData" ref="form" >
        <el-row :gutter="10" >
          <el-col :span="11" >
            <el-form-item label="交易账户" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.exch_group_no" :disabled="true" value-type="Number" :show-all="false"
                           :data="exchGroups">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交易市场" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.exch_no" :disabled="true" dict="exch_no" value-type="Number" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="提币币种" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.base_crncy_type" :disabled="true" dict="base_crncy_type" value-type="String" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="可提数量" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.avaliableNum" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="提币数量" prop="wtdraw_crncy_qty" :label-width="formLabelWidth">
              <el-input v-model.number="dialogFormData.wtdraw_crncy_qty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手续费" :label-width="formLabelWidth">
              <el-input v-model.number="dialogFormData.withdraw_fee" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="到账数量" :label-width="formLabelWidth">
              <el-input readonly :value="dialogFormData.wtdraw_crncy_qty - dialogFormData.withdraw_fee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="地址名称" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.addr_name" :data="withdrawAddressList"
                           @change="withdrawAddressChanged"
                           value-type="String" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="地址标签" :label-width="formLabelWidth">
              <el-input readonly :value="address.addr_tag" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="提币地址" :label-width="formLabelWidth">
              <el-input readonly :value="address.wtdraw_crncy_addr" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="info" @click="cancelHandler">
          取消
        </el-button>
        <el-button type="primary" @click="doWithdraw">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import _ from 'underscore'
  import { Button, ButtonGroup, Card, Col, Container, Dialog, DatePicker, Form, FormItem, Header, Input, Main, Pagination, Row, Tabs, TabPane, Table, TableColumn } from 'element-ui'
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import EasySelect from '@/components/EasySelect'
  import EasyTable from '@/components/EasyTable'
  import TableSearch from '@/components/TableSearch'
  import { positionMixin, styleMixin } from '@/mixins'
  import { format } from '@/tools/index'
  import * as moment from 'moment'
  export default {
    beforeMount () {
      this.SUBSCRIBE({
        funcCode: 'pushL.2.91',
        handler: this.addWithdrawRecord
      })
      this.SUBSCRIBE({
        funcCode: 'pushL.2.80',
        handler: this.updateExchGroupPosition
      })
    },
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup,
      'el-card': Card,
      'el-col': Col,
      'el-container': Container,
      'el-dialog': Dialog,
      'el-date-picker': DatePicker,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-header': Header,
      'el-input': Input,
      'el-main': Main,
      'el-pagination': Pagination,
      'el-row': Row,
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
      'el-table': Table,
      'el-table-column': TableColumn,
      EasySelect,
      EasyTable,
      TableSearch
    },
    computed: {
      ...mapState('websocket', {
        isConnected: state => state.isConnected,
        withdrawRecords: state => state.withdrawRecords,
        exchGroupPositions: state => state.exchGroupPositions
      }),
      ...mapState('cache', {
        products: state => state.products,
        exchGroups: state => state.exchGroups
      }),
      ...mapState('login', {
        user: state => state.user
      }),
      ...mapGetters('dict', ['translateDict']),
      withdrawRangeMessage () {
        return '提币数量必须在' + this.withdrawMinQty + '~' + this.withdrawMaxQty + '之间'
      },
      withdrawRules () {
        return [{
          type: 'number',
          require: true,
          message: '提币数量不能为空'
        }, {
          type: 'number',
          min: this.withdrawMinQty,
          max: this.withdrawMinQty,
          message: this.withdrawRangeMessage
        }]
      }
    },
    data () {
      return {
        avaliableNum: 0,
        address: {},
        beginEndDate: [moment().subtract(7, 'days').format('YYYYMMDD'), moment().format('YYYYMMDD')],
        currentExchGroup: null,
        currentPage: 1,
        dialogVisible: false,
        dialogFormData: {},
        exchGroupPositionColumns: [{
          title: '操作',
          type: 'operate',
          buttons: [{
            name: '提币',
            show () {
              return true
            },
            click: this.withdraw.bind(this)
          }]
        }, {
          title: '机构账户名称',
          name: 'pd_name'
        }, {
          title: '业务账户名称',
          name: 'asset_acco_name'
        }, {
          title: '交易账户名称',
          name: 'exch_group_name'
        }, {
          title: '交易市场',
          name: 'exch_name'
        }, {
          title: '币种',
          name: 'base_crncy_type',
          formatter (row, column, cellValue) {
            return this.translateDict('base_crncy_type', cellValue)
          }
        }, {
          title: '持仓数量',
          formatter: this.positionNumFormatter
        }, {
          title: '可提数量',
          formatter: this.avaliableNumFormatter
        }, ],
        formData: {},
        formLabelWidth: '80px',
        historyWithdrawRecords: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              picker.$emit('pick', [moment().subtract(7, 'days')._d, moment()._d])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              picker.$emit('pick', [moment().subtract(1, 'months')._d, moment()._d])
            }
          }]
        },
        withdrawRecordColumns: [{
          title: '提币时间',
          formatter (row, column, cellValue) {
            return format('date', 'yyyy-MM-dd', row.wtdraw_crncy_date) + ' ' + format('time', 'hh:mm:ss', row.wtdraw_crncy_time)
          }
        }, {
          title: '交易账户名称',
          name: 'exch_group_name',
          align: 'center'
        }, {
          title: '币种',
          name: 'base_crncy_type',
          align: 'center'
        }, {
          title: '提币状态',
          name: 'wtdraw_crncy_status',
          align: 'center',
          formatter (row, column, cellValue) {
            return this.translateDict('wtdraw_crncy_status', cellValue)
          }
        }, {
          title: '手续费',
          name: 'service_fee'
        }, {
          title: '提币地址',
          name: 'wtdraw_crncy_addr'
        }, {
          title: '交易市场',
          name: 'exch_no',
          formatter (row, column, cellValue) {
            return this.translateDict('exch_no', cellValue)
          }
        }, {
          title: '操作',
          type: 'operate',
          buttons: [{
            name: '撤销',
            show (row) {
              return row.wtdraw_crncy_status === '1'
            },
            click: this.cancelWithdraw.bind(this)
          }]
        }],
        withdrawMinQty: 0,
        withdrawMaxQty: 0,
        withdrawAddressList: []
      }
    },
    methods: {
      ...mapActions('exchGroup', ['initExchData']),
      ...mapMutations('websocket', ['SUBSCRIBE', 'setWithdrawRecords', 'addWithdrawRecord', 'setExchGroupPositions', 'updateExchGroupPosition']),
      cancelHandler () {
        this.dialogVisible = false
        this.dialogFormData = {}
        this.withdrawMinQty = 0
        this.withdrawMaxQty = 0
        this.address = {}
      },
      cancelWithdraw (index, row) {
        this.$confirm('您确定撤销此次提币操作吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.2.102.json', {
            wtdraw_crncy_id: row.wtdraw_crncy_id
          }).then(resp => {
            this.$message.success('撤销成功')
          })
        }, () => {
        })
      },
      currentPageChangeHandler (currentPage) {
        this.currentPage = currentPage
      },

      doWithdraw () {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$post('prodL.2.101.json', {
              ...this.dialogFormData
            }).then(resp => {
              this.$message.success('提币成功')
              this.dialogVisible = false
              this.queryCurrentWithdrawRecords()
            })
          }
        })
      },
      exchFormatter (row, column, cellValue) {
        return this.translateDict('exch_no', cellValue)
      },
      queryExchGroupPosi () {
        this.$post('prodL.2.21.json', {
          co_no: this.formData.co_no,
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          row_count: -1
        }).then(resp => {
          this.setExchGroupPositions(resp)
        })
      },
      queryCurrentWithdrawRecords () {
        this.$post('prodL.2.111.json', {
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          exch_no_str: '1',
          base_crncy_type: this.formData.base_crncy_type,
          row_count: -1
        }).then(resp => {
          this.setWithdrawRecords(resp)
        })
      },
      queryHistoryWithdrawRecords () {
        this.$post('prodL.2.112.json', {
          begin_date: this.beginEndDate[0],
          end_date: this.beginEndDate[1],
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          exch_no_str: '1',
          row_count: -1
        }).then(resp => {
          this.historyWithdrawRecords = resp
        })
      },
      queryAvaliableWithdrawAddress (param) {
        return new Promise((resolve, reject) => {
          this.$post('prodL.1.94.json', {
            ...param,
            row_count: -1
          }).then(resp => {
            resolve(resp)
          })
        })
      },
      setCurrentExchGroup (event, exchGroup) {
        this.currentExchGroup = exchGroup
        this.queryExchGroupPosi()
      },
      statusFormatter (row, column, cellValue) {
        return this.translateDict('wtdraw_crncy_status', cellValue)
      },
      subscribeTopic () {
        if (this.isConnected) {
          this.$socket.sendObj({
            sessionid: `${this.user.oper_station}`,
            api: 'secu.pdwithdraw',
            topic: `*.*.*`,
            type: 0,
            id: _.uniqueId()
          })
          this.$socket.sendObj({
            sessionid: `${this.user.oper_station}`,
            api: 'secu.pdexgpposi',
            topic: `*.*`,
            type: 0,
            id: _.uniqueId()
          })
        }
      },
      timeFormatter (row, column, cellValue) {
        return format('date', 'yyyy-MM-dd', row.wtdraw_crncy_date) + ' ' + format('time', 'hh:mm:ss', row.wtdraw_crncy_time)
      },
      withdraw (index, row) {
        let avaliableNum = row.curr_qty - row.frozen_qty - row.trade_capt_qty - row.strike_capt_qty + row.strike_releas_qty
        this.dialogFormData = {
          exch_group_no: row.exch_group_no,
          exch_no: row.exch_no,
          base_crncy_type: row.base_crncy_type,
          avaliableNum: avaliableNum,
          wtdraw_crncy_qty: avaliableNum
        }
        this.address = {}
        this.withdrawMaxQty = avaliableNum
        this.$post('pubL.17.64.json', {
          base_crncy_type: row.base_crncy_type
        }).then(resp => {
          this.dialogFormData.withdraw_fee = Number(resp[0].service_fee)
          this.withdrawMinQty = Number(resp[0].min_qty)
          if (this.withdrawMinQty > this.dialogFormData.avaliableNum) {
            this.$alert('可提币数量不足！', '警告', {
              lockScroll: false,
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
            })
          } else {
            this.dialogVisible = true
          }
        })
        this.queryAvaliableWithdrawAddress({
          pd_no: row.pd_no,
          asset_acco_no: row.asset_acco_no,
          exch_group_no: row.exch_group_no,
          exch_no: row.exch_no,
          base_crncy_type: row.base_crncy_type
        }).then(resp => {
          this.withdrawAddressList = resp.map(item => {
            return {
              label: item.addr_name,
              value: item.addr_name,
              addr_name: item.addr_name,
              addr_tag: item.addr_tag,
              wtdraw_crncy_addr: item.wtdraw_crncy_addr,
              single_qty_limit: item.single_qty_limit
            }
          })
        })
      },
      withdrawAddressChanged (val) {
        this.withdrawAddressList.forEach(address => {
          if (address.addr_name === val) {
            this.address = address
          }
        })
        this.withdrawMaxQty = this.address.single_qty_limit < this.withdrawMaxQty ? this.address.single_qty_limit : this.withdrawMaxQty
      }
    },
    mixins: [ positionMixin, styleMixin ],
    mounted () {
      this.subscribeTopic()
      this.queryExchGroupPosi()
      this.queryCurrentWithdrawRecords()
      this.queryHistoryWithdrawRecords()
    },
    watch: {
      isConnected () {
        if (this.isConnected) {
          this.$socket.sendObj({
            sessionid: `${this.user.oper_station}`,
            api: 'secu.pdwithdraw',
            topic: `*.*.*`,
            type: 0,
            id: _.uniqueId()
          })
          this.$socket.sendObj({
            sessionid: `${this.user.oper_station}`,
            api: 'secu.pdexgpposi',
            topic: `*.*`,
            type: 0,
            id: _.uniqueId()
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-container {
    width: calc(100% - 180px);
    padding: 10px 0 10px 10px;
  }

  .text {
    font-size: 14px;
  }
  .item {
    height: 30px;
    line-height: 30px;
    margin-bottom: 8px;
    cursor: pointer;
    &:hover {
      background-color: #f5f7fa;
    }
    &.is-current {
      background-color: #f5f7fa;
    }
  }

  /deep/ .table-tools {
    height: 40px;
    line-height: 40px;
    padding: 0;
    position: relative;
  }

  /deep/ .el-pagination {
    margin: 20px 20px 20px 0;
  }

  /deep/ .el-tabs {
    margin: 40px 0 0 0;
    .el-tabs__content {
      margin-bottom: 10px;
    }
  }

  /deep/ .el-date-editor {
    .el-input__icon.el-icon-date{
      display: none;
    }
    .el-range-separator {
      width: 20px;
    }
    .el-range-input {
      width: 100px;
    }
  }

</style>
