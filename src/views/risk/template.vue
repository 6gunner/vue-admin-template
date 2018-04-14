<!--风控模板-->
<template>
  <div>
    <el-row :style="{height: computedStyle.height + 'px'}" :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>风控模板</span>
          </div>
          <div class="text item" v-for="template in templateData"
               v-on:click="setSelectedTemplate($event, template)"
               :key="template.row_id"
               :class="{'is-current': selectedTemplate === template}">
            {{ template.model_name }}
          </div>
          <div class="bottom">
            <el-button-group>
              <el-button type="primary" @click="addTemplateHandler" >增加模板</el-button>
              <el-button type="danger" @click="deleteTemplateHandler" :disabled="selectedTemplate === null">删除模板</el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <easy-table ref="table" :columns="columns" :data="templateItems"
                    @current-change="(currentRow) => {selectedRow = currentRow}"
                    :table-height="computedStyle.tableHeight + 'px' ">
          <slot>
            <el-button-group>
              <el-button type="primary" @click="addHandler" :disabled="selectedTemplate === null">编辑模板记录</el-button>
              <el-button type="danger" :disabled="selectedRow === null" @click="deleteHandler">删除模板记录</el-button>
            </el-button-group>
            <el-button-group class="btn-right">
              <el-button type="primary" size="small" @click="queryTemplateItems">刷新</el-button>
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
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="30%"
               :title="dialogTitle"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="false"
               :close-on-click-modal="false"
               class="risk-rule-dialog">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="模板名称" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.model_id" :disabled="dialogType==='edit'"
                           :data="customTemplates" value-type="Number" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="风控条目" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.risk_item_id_str" :data="riskItems" multiple :collapse-tags="false"
                           value-type="String" :show-all="false">
              </easy-select>
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

    <el-dialog :visible.sync="templateDialogVisible" width="30%" title="新增风控模板">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="模板名称" :label-width="formLabelWidth">
              <el-input v-model="templateDialogFormData.model_name">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="templateDialogFormData.remark_info" type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary"  @click="doHandlerTemplate">
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
    beforeMount () {
      this.$post('rksecuL.1.5.json', {
        row_count: -1
      }).then(resp => {
        this.riskItems = resp.map(item => {
          return {
            label: item.risk_item_name,
            value: item.row_id
          }
        })
      })
    },
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
      ...mapGetters('cache', ['filterSymbol']),

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
        computedStyle: {},
        columns: [{
          title: '风控模板名称',
          name: 'model_name'
        }, {
          title: '风控条目名称',
          name: 'risk_item_name',
        }, {
          title: '风控规则类型',
          name: 'risk_rule_type',
          formatter(row, column, cellValue) {
            return this.translateDict('risk_rule_type', cellValue)
          }
        }],
        dialogVisible: false,
        dialogTitle: '',
        dialogType: '',
        dialogFormData: {},
        formLabelWidth: '105px',
        riskItems: [],
        selectedTemplate: null,
        selectedTemplateItem: '',
        selectedRow: null,
        templateData: [],
        templateDialogTitle: '',
        templateDialogVisible: false,
        templateDialogType: 'add',
        templateDialogFormData: {},
        templateItems: [],
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
        this.dialogTitle = '编辑风险模板条目'
        this.dialogVisible = true
        this.dialogFormData = {
          model_id: this.selectedTemplate ? this.selectedTemplate.row_id : null,
          risk_item_id_str: this.templateItems.map(item=>item.risk_item_id)
        }
      },
      addTemplateHandler () {
        this.templateDialogType = 'add'
        this.templateDialogVisible = true
      },
      deleteHandler() {
        this.$confirm('您确定删除此维度币对代码吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.3.8.json', {
            dime_type_code: this.selectedDimenTypeCode,
            exch_no: this.selectedRow.exch_no,
            stock_code: this.selectedRow.stock_code
          }).then(resp => {
            this.$message.success('删除成功')
            this.queryDimensionStock()
          })
        })
      },
      deleteTemplateHandler () {
        this.$confirm('您确定删除此模板吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.1.7.json', {
            model_id: this.selectedTemplate.row_id
          }).then(resp => {
            this.$message.success('删除成功')
            this.queryTemplates()
          })
        })
      },
      doHandlerTemplate () {
        if (this.templateDialogType === 'add') {
          // 新增机构维度类型
          this.$post('rksecuL.1.6.json', {
            model_name: this.templateDialogFormData.model_name
          }).then(resp => {
            this.$message.success('增加成功')
            this.templateDialogVisible = false
            this.queryTemplates()
          })
        }
      },
      doHandler () {
        if (this.dialogType === 'add') {
          this.$post('rksecuL.1.10.json', {
            model_id: this.dialogFormData.model_id,
            risk_item_id_str: this.dialogFormData.risk_item_id_str.join(';')
          }).then(resp => {
            this.$message.success('增加成功')
            this.dialogVisible = true
            this.queryTemplateItems()
          })
        }
      },
      queryTemplates (template) {
        this.$post('rksecuL.1.9.json', {row_count: -1}).then(resp => {
          this.templateData = resp
        })
      },
      queryTemplateItems () {
        if (this.selectedTemplate) {
          this.$post('rksecuL.1.12.json', {
            model_id: this.selectedTemplate.row_id,
            row_count: -1
          }).then(resp => {
            this.templateItems = resp
          })
        }
      },
      setSelectedTemplate(event, data) {
        this.selectedTemplate = data
        this.queryTemplateItems()
      }
    },

    mounted() {
      let height = document.querySelector('.el-main').clientHeight
      this.computedStyle = {
        height: height - 45,
        tableHeight: height - 45 - 300
      }
      this.queryTemplates()
      this.queryTemplateItems()
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
