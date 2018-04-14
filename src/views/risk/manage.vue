<!--风控设置-->
<template>
  <div>
    <easy-table ref="table" :columns="columns" :data="accountRiskRules"
                @current-change="(currentRow) => {selectedRow = currentRow}"
                :table-height="computedStyle.tableHeight + 'px' ">
      <slot>
        <el-button-group>
          <el-button type="primary" @click="addHandler">新增</el-button>
          <el-button type="info" @click="addHandler" :disabled="selectedRow === null">修改</el-button>
          <el-button type="danger" :disabled="selectedRow === null" @click="deleteHandler">删除</el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="success" :disabled="selectedRow === null" @click="enableHandler">启用</el-button>
          <el-button type="warning" :disabled="selectedRow === null" @click="disableHandler">停用</el-button>
          <el-button type="success"  @click="enableAllHandler">启用所有</el-button>
          <el-button type="warning"  @click="disableAllHandler">停用所有</el-button>
        </el-button-group>
        <el-button-group class="btn-right">
          <el-button type="primary" size="small" @click="queryAccountRiskRules">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
    <el-card v-if="templateItemDetail!=null">
      <div slot="header" class="clearfix">
        <span>详细信息</span>
      </div>
      <div class="card-content">
        <div class="card-item">
          <span>
            <label>条目名称：</label>
            {{templateItemDetail.risk_item_name}}
          </span>
          <span>
            <label for="">启用标志：</label>{{translateDict('rule_flag', templateItemDetail.rule_flag) }}
          </span>
          <span>
            <label for="">风控类型：</label>{{translateDict('risk_rule_type', templateItemDetail.risk_rule_type)}}
          </span>
        </div>
        <div class="card-item">
          <span><label for="">维度类型：</label>{{translateDict('dime_type', templateItemDetail.dime_type)}}</span>
          <span><label for="">维度值：</label>{{templateItemDetail.dim_code_str}}</span>
        </div>
        <div class="card-item">
          <span>
            <label for="">风控规则：</label>
            <div style="margin-top: -18px">
            <p v-if="templateItemDetail.risk_rule_value_str1!==' '">
              <span>{{templateItemDetail | riskRuleFilter(1)}}</span>
              <el-tag :type="templateItemDetail.risk_rule_action1 | actionTypeFilter">{{translateDict('risk_rule_action', templateItemDetail.risk_rule_action1)}}</el-tag>
            </p>
            <p v-if="templateItemDetail.risk_rule_value_str2!==' ' && templateItemDetail.risk_rule_value_str2!==''">
              <span>{{templateItemDetail | riskRuleFilter(2)}}</span>
              <el-tag :type="templateItemDetail.risk_rule_action2 | actionTypeFilter">{{translateDict('risk_rule_action', templateItemDetail.risk_rule_action2)}}</el-tag>
            </p>
            <p v-if="templateItemDetail.risk_rule_value_str3!==' ' && templateItemDetail.risk_rule_value_str3!==''">
              <span >{{templateItemDetail | riskRuleFilter(3)}}</span>
              <el-tag :type="templateItemDetail.risk_rule_action3 | actionTypeFilter">{{translateDict('risk_rule_action', templateItemDetail.risk_rule_action3)}}</el-tag>
            </p>
            <p v-if="templateItemDetail.risk_rule_value_str4!==' ' && templateItemDetail.risk_rule_value_str4!==''">
              <span >{{templateItemDetail | riskRuleFilter(4)}}</span>
              <el-tag :type="templateItemDetail.risk_rule_action4 | actionTypeFilter">{{translateDict('risk_rule_action', templateItemDetail.risk_rule_action4)}}</el-tag>
            </p>
            </div>
          </span>
        </div>
        <div class="card-item">
          <span><label for="">开始时间：</label>{{templateItemDetail.begin_time | timeFilter}}</span>
          <span><label for="">结束时间：</label>{{templateItemDetail.end_time | timeFilter}}</span>
        </div>
      </div>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" width="50%" top="5vh"
               :title="dialogTitle"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="false"
               :close-on-click-modal="false"
               class="risk-rule-dialog">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="控制级别" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.ctrl_level" dict="ctrl_level" :show-all="false" @change="(val) => ctrlLevel = val" value-type="Number">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" >
            <el-form-item label="机构账户" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.pd_no_str" :disabled="dialogType==='edit'" value-type="String"
                           :data="avaliableProducts" :multiple="true">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-show="ctrlLevel === 1">
            <el-form-item label="交易账户" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.exch_group_no_str" :disabled="dialogType==='edit'" value-type="String"
                           :data="avaliableExchGroups" :multiple="true">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联合类型" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.union_flag" dict="union_flag" value-type="Number" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设置方式" :label-width="formLabelWidth">
              <el-select v-model="settingWay">
                <el-option label="按模板设置" value="1"></el-option>
                <el-option label="按条目设置" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="settingWay==='2'">
            <el-col :span="11">
              <el-form-item label="风控类型" :label-width="formLabelWidth">
                <easy-select v-model="dialogFormData.risk_rule_type" :disabled="dialogType==='edit'"
                             dict="risk_rule_type" value-type="Number" :show-all="false">
                </easy-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="风控条目" :label-width="formLabelWidth">
                <easy-select v-model="dialogFormData.risk_item_id" :data="filterRiskItems(dialogFormData.risk_rule_type)"
                             value-type="String" :show-all="false">
                </easy-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="11" v-else>
            <el-form-item label="模板名称" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.model_id" :data="riskTemplates" value-type="String" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否启用" :label-width="formLabelWidth">
              <el-switch
                v-model="dialogFormData.rule_flag"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary"  @click="doHandler">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import _ from 'underscore'
  import {
    Button,
    ButtonGroup,
    Card,
    Col,
    Dialog,
    Form,
    FormItem,
    Input,
    Row,
    Radio,
    RadioGroup,
    Select,
    Switch,
    Tag,
    Option,
    TimePicker
  } from 'element-ui'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import RuleItem from '@/views/comps/rule-item'
  import {mapState, mapGetters} from 'vuex'
  import {format} from '@/tools/index'

  export default {
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup,
      'el-card': Card,
      'el-col': Col,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-row': Row,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-select': Select,
      'el-switch': Switch,
      'el-tag': Tag,
      'el-time-picker': TimePicker,
      'el-option': Option,
      EasySelect,
      EasyTable
    },
    computed: {
      ...mapGetters('dict', ['translateDict', 'getDictByName']),
      ...mapState('cache', {
        riskItems: state => state.riskItems,
        riskTemplates: state => state.riskTemplates
      }),
      ...mapState('login', {
        user: state => state.user
      }),
      ...mapGetters('cache', ['filterSymbol', 'avaliableProducts', 'avaliableExchGroups', 'filterRiskItems']),
      customTemplates () {
        return this.templateData.map(item => {
          return {
            label: item.model_name,
            value: item.row_id
          }
        })
      }
    },
    data() {
      return {
        accountRiskRules: [],
        computedStyle: {},
        columns: [{
          title: '是否启用',
          name: 'rule_flag',
          formatter(row, column, cellValue) {
            return this.translateDict('rule_flag', cellValue)
          }
        }, {
          title: '控制层级',
          name: 'ctrl_level',
          formatter(row, column, cellValue) {
            return this.translateDict('ctrl_level', cellValue)
          }
        }, {
          title: '机构账户名称',
          name: 'pd_name_str'
        }, {
          title: '交易账户名称',
          name: 'exch_group_name_str'
        }, {
          title: '联合标志',
          name: 'union_flag',
          formatter(row, column, cellValue) {
            return this.translateDict('union_flag', cellValue)
          }
        }, {
          title: '模板名称',
          name: 'model_name'
        },{
          title: '风险条目名称',
          name: 'risk_item_name'
        }, {
          title: '风控类型',
          name: 'risk_rule_type',
          formatter(row, column, cellValue) {
            return this.translateDict('risk_rule_type', cellValue)
          }
        }],
        ctrlLevel: 1,
        dialogVisible: false,
        dialogTitle: '',
        dialogType: '',
        dialogFormData: {},
        formLabelWidth: '105px',
        selectedRow: null,
        settingWay: '1',
        templateData: [],
        templateItemDetail: null
      }
    },
    filters: {
      riskRuleFilter (detail, index) {
        let i = 0
        let str = detail.risk_rule_name.replace('[n]', function () {
          i++
          return '' + detail['risk_rule_value_str' + index].split(';')[i - 1]
        })
        return str
      },
      timeFilter (val) {
        return format('time', 'hh:mm:ss', val)
      },
      actionTypeFilter(type) {
        switch(type) {
          case '1':
            return ''
          case '2':
            return 'success'
          case '3':
            return 'warning'
          case '4':
            return 'danger'
        }
      }
    },
    methods: {
      addHandler() {
        this.dialogType = 'add'
        this.dialogTitle = '新增账户风控设置'
        this.dialogVisible = true
        this.dialogFormData = {
          ctrl_level: 1
        }
      },
      editHandler() {
        this.dialogType = 'edit'
        this.dialogTitle = '修改账户风控设置'
        this.dialogVisible = true
        this.dialogFormData = {
        }
      },
      deleteHandler() {
        this.$confirm('您确定删除此账户风控设置吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.4.2.json', {
            client_risk_rule_id_str: this.selectedRow.row_id
          }).then(resp => {
            this.$message.success('删除成功')
            this.queryAccountRiskRules()
          })
        })
      },
      doHandler () {
        if (this.dialogType === 'add') {
          this.$post('rksecuL.4.1.json', {
            pd_no_str: this.dialogFormData.pd_no_str.join(';'),
            exch_group_no_str: this.dialogFormData.exch_group_no_str.join(';'),
            trig_stage_type_str: '2',
            ctrl_level: this.dialogFormData.ctrl_level,
            model_id: this.dialogFormData.model_id,
            risk_item_id: this.dialogFormData.risk_item_id,
            union_flag: this.dialogFormData.union_flag,
            rule_flag: this.dialogFormData.rule_flag ? 1 : 2
          }).then(resp => {
            this.$message.success('增加成功')
            this.dialogVisible = false
            this.queryAccountRiskRules()
          })
        }
      },
      enableHandler () {
        this.$confirm('您确定启用此风控规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.4.31.json', {
            row_id: this.selectedRow.row_id,
            rule_flag: 1
          }).then(resp => {
            this.$message.success('启用成功')
            this.queryAccountRiskRules()
          })
        })
      },
      disableHandler () {
        this.$confirm('您确定停用此风控规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.4.31.json', {
            row_id: this.selectedRow.row_id,
            rule_flag: 2
          }).then(resp => {
            this.$message.success('停用成功')
            this.queryAccountRiskRules()
          })
        })
      },
      enableAllHandler () {
        this.$confirm('您确定启用此所有风控规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.4.301.json', {
            rule_flag: 1
          }).then(resp => {
            this.$message.success('启用成功')
            this.queryAccountRiskRules()
          })
        })
      },
      disableAllHandler () {
        this.$confirm('您确定启用此所有风控规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.4.301.json', {
            rule_flag: 2
          }).then(resp => {
            this.$message.success('停用成功')
            this.queryAccountRiskRules()
          })
        })
      },
      queryAccountRiskRules (template) {
        this.$post('rksecuL.4.30.json', {row_count: -1}).then(resp => {
          this.accountRiskRules = resp
        })
      }
    },
    mounted() {
      let height = document.querySelector('.el-main').clientHeight
      this.computedStyle = {
        height: height - 45,
        tableHeight: height - 45 - 300
      }
      this.queryAccountRiskRules()
    },
    watch: {
      selectedRow (newVal, oldVal) {
        if (newVal) {
          this.$post('rksecuL.1.51.json', {
            risk_item_id: newVal.risk_item_id
          }).then(resp => {
            this.templateItemDetail = resp
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .el-select {
    width: 100%;
  }
  .el-col {
    height: 100%;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    height: 30px;
    line-height: 30px;
    margin-bottom: 8px;
    cursor: pointer;
    &::hover {
      background-color: #f5f7fa;
    }
    &.is-current {
      background-color: #f5f7fa;
    }
  }

  .box-card {
    width: 100%;
    height: 95%;
    margin: 0 5px;
    padding: 0;
    position: relative;
    .bottom {
      margin: 13px auto;
      line-height: 12px;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      position: absolute;
    }
  }
  .risk-rule-dialog {
    .el-dialog__body {
      padding: 20px;
    }
    .el-radio-group {
      width: 100%;
      display: block;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 5px 15px;
      .el-radio {
        display: block;
        width: 100%;
        margin: 5px 0;
      }
    }
    .box {
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      width: 100%;
      height: 200px;
      margin: 0 5px;
      padding: 0;
      .box-header {
        padding: 0px 20px;
      }
      .box-content {
        padding: 0 20px;
        border: 1px solid #fafafa;
        background-color: oldlace;
      }
    }
  }
  .card-content {
    .card-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      margin: 10px 0;
      p {
        margin-left: 80px;
      }
      & > span {
        display: inline-block;
        margin-left: 60px;
        font-size: 14px;
        color: #409EFF;
        label {
          color: #000;
          font-size: 14px;
          margin-right: 5px;
        }
        &:first-child {
          margin-left: 20px;
        }
      }
    }
  }
</style>
