<!--风控维度-->
<template>
  <div>
    <el-row :style="{height: computedStyle.height + 'px'}" :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>风控规则</span>
          </div>
          <el-tree :data="riskRuleTypes" node-key="value" :props="{'label': 'label', 'children': 'children', 'isLeaf': 'isLeaf'}"
                   @node-click="riskRuleTreeClickHandler">
                   <!--lazy :load="loadNode"-->
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <span>风控条目</span>
          </div>
          <easy-table ref="table" :columns="columns" :data="riskRuleItems"
                      @current-change="(currentRow) => {selectedRow = currentRow}">
            <slot>
              <el-button-group>
                <el-button type="info" size="small" @click="addHandler">新增</el-button>
                <el-button type="primary" size="small" :disabled="selectedRow === null" @click="editHandler">修改
                </el-button>
                <el-button type="danger" size="small" :disabled="selectedRow === null" @click="deleteHandler">删除
                </el-button>
              </el-button-group>
              <el-button-group>
                <el-button type="success" size="small" :disabled="selectedRow === null" @click="enableHandler">启用
                </el-button>
                <el-button type="warning" size="small" :disabled="selectedRow === null" @click="disableHandler">禁用
                </el-button>
              </el-button-group>
              <el-button-group class="btn-right">
                <el-button type="primary" size="small" @click="queryRiskRuleItems">刷新</el-button>
              </el-button-group>
            </slot>
          </easy-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" top="5vh" width="60%"
               :title="dialogTitle"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="false"
               :close-on-click-modal="false"
               class="risk-rule-dialog">
      <el-steps :active="activeStep" simple>
        <el-step title="设置风控条目" icon="el-icon-edit"></el-step>
        <el-step title="配置条目行为" icon="el-icon-setting"></el-step>
      </el-steps>
      <div v-show="activeStep===1" class="risk-rule-dialog-content">
        <el-form>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="风控条目名称" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.risk_item_name" >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="控制订单方向" :label-width="formLabelWidth">
                <easy-select v-model="dialogFormData.order_dir_str" :multiple="true" :show-all="false" dict="order_dir" value-type="String">
                </easy-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="风控规则" :label-width="formLabelWidth">
                <easy-select v-model="dialogFormData.risk_rule_type" :disabled="true" dict="risk_rule_type"
                             value-type="Number" :show-all="false"
                             @change="queryRiskTypeRules">
                </easy-select>
                <el-radio-group v-model="dialogFormData.risk_rule_id" :disabled="dialogType==='edit'">
                  <el-radio v-for="typeRule in riskTypeRules" :key="typeRule.row_id" :label="typeRule.row_id"
                            @change="setRiskTypeRule(typeRule)">
                    {{typeRule.risk_rule_name}}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="维度类型" :label-width="formLabelWidth">
                <easy-select v-model="dialogFormData.dime_type" dict="dime_type" value-type="Number" :show-all="false"
                             @change="changeDimensions">
                </easy-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="维度值" :label-width="formLabelWidth">
                <easy-select v-model="dialogFormData.dim_code_str" :data="dimensions" ref="dimCodeStrSelector"
                             :multiple="true" :show-all="false" value-type="String">
                </easy-select>
              </el-form-item>
            </el-col>

              <el-col :span="11">
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                  <el-time-picker
                    size="small"
                    v-model="dialogFormData.begin_time"
                    value-format="HHmmss"
                    format="HH:mm"
                    placeholder="开始时间">
                  </el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                  <el-time-picker
                    size="small"
                    v-model="dialogFormData.end_time"
                    value-format="HHmmss"
                    format="HH:mm"
                    placeholder="结束时间">
                  </el-time-picker>
                </el-form-item>
              </el-col>
          </el-row>

        </el-form>
      </div>
      <div v-show="activeStep===2" class="risk-rule-dialog-content">
        <el-form>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item label="风控行为" :label-width="formLabelWidth">
                <div class="box">
                  <div class="box-header">
                    <el-button type="text" @click="addRiskTypeHandler"><i class="el-icon-plus"></i> 添加</el-button>
                    <el-button type="text" @click="removeRiskTypeHandler"><i class="el-icon-delete"></i> 删除</el-button>
                  </div>
                  <ol class="box-content">
                    <rule-item v-for="(rule, i) in ruleItemValues"
                               :key="i"
                               :risk-rule-name="choosedRiskTypeRule.risk_rule_name"
                               :action="ruleActions[i]"
                               :rule="rule"
                               @actionChange="action => ruleActions[i] = action"
                               ref="ruleItem"></rule-item>
                  </ol>
                </div>
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
      </div>
      <div slot="footer" class="dialog-footer">
        <template v-if="activeStep === 1">
          <el-button  @click="dialogVisible = false" >
            取 消
          </el-button>
          <el-button type="primary"  @click="activeStep++" v-if="activeStep === 1">
            下一步
          </el-button>
        </template>
        <template v-else>
          <el-button @click="activeStep--">
            上一步
          </el-button>
          <el-button type="primary"  @click="doHandler">
            确定
          </el-button>
        </template>
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
    Switch,
    Steps,
    Step,
    TimePicker,
    Tree
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
      'el-switch': Switch,
      'el-steps': Steps,
      'el-step': Step,
      'el-time-picker': TimePicker,
      'el-tree': Tree,
      EasySelect,
      EasyTable,
      RuleItem
    },
    computed: {
      ...mapGetters('dict', ['translateDict', 'getDictByName']),
      ...mapState('cache', {
        symbols: state => state.symbols,
        userDimensions: state => state.userDimensions,
        systemDimensions: state => state.systemDimensions
      }),
      ...mapState('login', {
        user: state => state.user
      }),
      riskRuleTypes () {
        let results = []
        _.each(this.getDictByName('risk_rule_type'), (value, key) => {
          results.push({
            label: value,
            value: Number(key)
          })
        })
        return results
      }
    },
    data () {
      return {
        activeStep: 1,
        computedStyle: {},
        columns: [{
          title: '风险条目名称',
          name: 'risk_item_name'
        }, {
          title: '风险规则类型',
          name: 'risk_rule_type',
          formatter(row, column, cellValue) {
            return this.translateDict('risk_rule_type', cellValue)
          }
        }, {
          title: '订单方向',
          name: 'order_dir_str',
          formatter(row, column, cellValue) {
            return cellValue.split(';').map(item => this.translateDict('order_dir', item)).join(',')
          }
        }, {
          title: '开始 - 结束时间',
          name: 'begin_time',
          formatter(row, column, cellValue) {
            if (!row.begin_time && !row.end_time) {
              return '全天'
            } else {
              return format('time', 'hh:mm:ss', row.begin_time) + '-' + format('time', 'hh:mm:ss', row.end_time)
            }
          }
        }, {
          title: '是否启用',
          name: 'rule_flag',
          formatter(row, data, cellValue) {
            return this.translateDict('rule_flag', cellValue)
          }
        }],
        currentRuleType: '1',
        dialogVisible: false,
        dialogTitle: '',
        dialogType: '',
        dialogFormData: {
        },
        ruleItemValues: [],
        ruleActions: [],
        dimensions: [],
        formLabelWidth: '105px',
        riskRuleItems: [],
        choosedRiskTypeRule: {},
        riskTypeRules: [],
        selectedRow: null
      }
    },
    methods: {
      addHandler() {
        this.dialogType = 'add'
        this.dialogTitle = '新增风控条目'
        this.dialogFormData = {
          risk_rule_type: Number(this.currentRuleType),
          dime_type: 4
        }
        this.activeStep = 1
        this.dimensions = this.systemDimensions
        this.ruleItemValues = ['0', '0', '0', '0']
        this.ruleActions = [1, 2, 3, 4]
        this.queryRiskTypeRules(this.currentRuleType).then((resp)=>{
          this.choosedRiskTypeRule = resp[0]
          this.dialogVisible = true
        })
      },
      addRiskTypeHandler () {
        if (this.ruleItemValues.length < 4) {
          this.ruleItemValues.push('0')
          this.ruleActions.push(1)
        }
      },
      removeRiskTypeHandler () {
        if (this.ruleItemValues.length > 1) {
          this.ruleItemValues.pop()
          this.ruleActions.pop()
        }
      },
      changeDimensions(dimensionType) {
        switch (dimensionType) {
          case 1 :
            let options = []
            _.each(this.getDictByName('base_crncy_type'), (value, key) => {
              options.push({
                label: value,
                value: key
              })
            })
            this.dimensions = options
            break
          case 2 :
            this.dimensions = this.symbols
            break
          case 3 :
            this.dimensions = this.userDimensions
            break
          case 4 :
            this.dimensions = this.systemDimensions
            break
        }
        this.dialogFormData.dim_code_str = []
      },
      deleteHandler() {
        this.$confirm('您确定删除此风控规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          this.$post('rksecuL.1.4.json', {
            risk_item_id_str: this.selectedRow.row_id
          }).then(resp => {
            this.queryRiskRuleItems()
          })
        }, () => {return})
      },
      disableHandler() {
        this.$confirm('您确定禁用此风控规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.1.13.json', {
            risk_item_id_str: this.selectedRow.row_id,
            risk_rule_type: this.selectedRow.risk_rule_type,
            rule_flag: 2
          }).then(resp => {
            this.queryRiskRuleItems()
          })
        }, () => {return})
      },
      doHandler () {
        if (this.dialogType === 'add') {
          let data = this.dialogFormData
          this.$refs.ruleItem.forEach((item, index) => {
            this['risk_rule_value_str' + (index + 1)] = item.getValue()
          })
          this.$post('rksecuL.1.2.json', {
            exch_no_str: '1',
            order_dir_str: data.order_dir_str.join(';'),
            dime_type: data.dime_type,
            dim_code_str: data.dim_code_str.join(';'),
            risk_item_name: data.risk_item_name,
            risk_rule_type: data.risk_rule_type,
            risk_rule_id: data.risk_rule_id,
            risk_rule_value_str1: this.risk_rule_value_str1,
            risk_rule_action1: this.ruleActions[0],
            risk_rule_value_str2: this.risk_rule_value_str2,
            risk_rule_action2: this.ruleActions[1],
            risk_rule_value_str3: this.risk_rule_value_str3,
            risk_rule_action3: this.ruleActions[2],
            risk_rule_value_str4: this.risk_rule_value_str4,
            risk_rule_action4: this.ruleActions[3],
            begin_time: data.begin_time,
            end_time: data.end_time,
            rule_flag: data.rule_flag ? 1 : 2
          }).then(resp => {
            this.$message.success('添加条目成功')
            this.queryRiskRuleItems()
            this.dialogVisible = false
          })
        } else if (this.dialogType === 'edit') {
          let data = this.dialogFormData
          this.$refs.ruleItem.forEach((item, index) => {
            this['risk_rule_value_str' + (index + 1)] = item.getValue()
          })
          this.$post('rksecuL.1.3.json', {
            row_id: this.selectedRow.row_id,
            exch_no_str: '1',
            order_dir_str: data.order_dir_str.join(';'),
            dime_type: data.dime_type,
            dim_code_str: data.dim_code_str.join(';'),
            risk_item_name: data.risk_item_name,
            risk_rule_type: data.risk_rule_type,
            risk_rule_id: data.risk_rule_id,
            risk_rule_value_str1: this.risk_rule_value_str1,
            risk_rule_action1: this.ruleActions[0],
            risk_rule_value_str2: this.risk_rule_value_str2,
            risk_rule_action2: this.ruleActions[1],
            risk_rule_value_str3: this.risk_rule_value_str3,
            risk_rule_action3: this.ruleActions[2],
            risk_rule_value_str4: this.risk_rule_value_str4,
            risk_rule_action4: this.ruleActions[3],
            begin_time: data.begin_time,
            end_time: data.end_time,
            rule_flag: data.rule_flag ? 1 : 2
          }).then(resp => {
            this.$message.success('修改条目成功')
            this.queryRiskRuleItems()
            this.dialogVisible = false
          })
        }
      },
      editHandler () {
        this.dialogType = 'edit'
        this.dialogTitle = '修改风控条目'
        this.changeDimensions(this.selectedRow.dime_type)
        this.dialogFormData = {
          risk_item_name: this.selectedRow.risk_item_name,
          order_dir_str: this.selectedRow.order_dir_str.split(';'),
          risk_rule_type: this.selectedRow.risk_rule_type,
          risk_rule_id: this.selectedRow.risk_rule_id,
          dime_type: this.selectedRow.dime_type,
          dim_code_str: this.selectedRow.dim_code_str.split(';'),
          begin_time: format('time','hhmmss', this.selectedRow.begin_time),
          end_time: format('time', 'hhmmss', this.selectedRow.end_time),
          rule_flag: this.selectedRow.rule_flag === 1 ? true : false
        }
        this.activeStep = 1
        for (let i = 1; i <=4 ; i++) {
          if (this.selectedRow['risk_rule_action'+i]!==' ') {
            this.ruleActions[i-1] = Number(this.selectedRow['risk_rule_action'+i])
          }
          if (this.selectedRow['risk_rule_value_str'+i]!==' ') {
            this.ruleItemValues[i-1] = this.selectedRow['risk_rule_value_str'+i]
          }
        }
        this.queryRiskTypeRules(this.selectedRow.risk_rule_type).then((resp)=>{
          this.choosedRiskTypeRule = resp[0]
          this.dialogVisible = true
        })
      },
      enableHandler () {
        this.$confirm('您确定启用此风控规则吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.1.13.json', {
            risk_item_id_str: this.selectedRow.row_id,
            risk_rule_type: this.selectedRow.risk_rule_type,
            rule_flag: 1
          }).then(resp => {
            this.queryRiskRuleItems()
          })
        }, () => {return})
      },
      loadNode (node, resolve) {
        if (node.level === 0) {
          return resolve(this.riskRuleTypes);
        }
        this.$post('rksecuL.1.1.json', {
          risk_rule_type: node.data.value,
          row_count: -1
        }).then(resp => {
          resolve(resp.map(item => {
            return {
              label: item.risk_rule_name,
              isLeaf: true
            }
          }))
        })
      },
      // 查询风控条目
      queryRiskRuleItems() {
        return this.$post('rksecuL.1.5.json', {
          risk_rule_type: this.currentRuleType,
          row_count: -1
        }).then(resp => {
          this.riskRuleItems = resp
        })
      },
      // 查询风控类型规则
      queryRiskTypeRules(val) {
        return new Promise((resolve, reject) => {
          this.$post('rksecuL.1.1.json', {
            risk_rule_type: val,
            row_count: -1
          }).then(resp => {
            this.riskTypeRules = resp
            resolve(resp)
          })
        })
      },
      riskRuleTreeClickHandler (data, node, $node) {
        if (node.level === 1) {
          this.currentRuleType = data.value
          this.queryRiskRuleItems()
        }
      },
      setRiskTypeRule(riskTypeRule) {
        this.choosedRiskTypeRule = riskTypeRule
      }
    },
    mounted() {
      let height = document.querySelector('.el-main').clientHeight
      this.computedStyle = {
        height: height - 45
      }
      this.queryRiskRuleItems()
    },
    watch: {
    }
  }
</script>
<style lang="scss" scoped>
  .el-col {
    height: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  /deep/ .el-tree {
    font-size: 14px;
  }
  .box-card {
    width: 100%;
    margin: 0 5px;
    padding: 0;
  }
  .risk-rule-dialog {
    .risk-rule-dialog-content {
      border: 1px solid #dcdfe6;
      border-top: none;
      padding: 40px 0;
    }
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
    /deep/ .el-step.is-simple .el-step__icon {
      vertical-align: middle;
    }
    .box {
      width: 100%;
      height: 200px;
      margin: 0 5px;
      padding: 0;
      .box-header {
        width: 100%;
        height: 32px;
        text-align: right;
        padding: 0px 20px;
      }
      .box-content {
        height: 168px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        padding: 20px;
        li {
        }
      }
    }
  }
</style>
