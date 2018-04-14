<template>
  <div>
    <el-row :style="{height: computedStyle.height + 'px'}" :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-select v-model="dimensionType" @change="queryCustomDimensionType">
              <el-option label="系统自定义" :value="1">
              </el-option>
              <el-option label="机构自定义" :value="2">
              </el-option>
            </el-select>
          </div>
          <div class="text item" v-for="dimensionType in dimensionTypeData"
               v-on:click="setSelectedDimenTypeCode($event, dimensionType)"
               :key="dimensionType.dime_type_code"
               :class="{'is-current': selectedDimenType === dimensionType}">
            {{ dimensionType.dime_type_name }}
          </div>
          <div class="bottom" v-show="dimensionType === 2">
            <el-button-group>
              <el-button type="primary" @click="addDimensionTypeHandler">增加维度</el-button>
              <el-button type="danger" @click="deleteDimensionTypeHandler" :disabled="selectedDimenType === null">删除维度</el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <easy-table ref="table" :columns="columns" :data="dimenTypeCodes"
                    @current-change="(currentRow) => {selectedRow = currentRow}">
          <slot >
            <el-button-group v-show="dimensionType === 2">
              <el-button type="primary" @click="addHandler">新增</el-button>
              <el-button type="danger":disabled="selectedRow === null" @click="deleteHandler">删除
              </el-button>
            </el-button-group>
            <el-button-group class="btn-right">
              <el-button type="primary" size="small" @click="queryDimensionStock">刷新</el-button>
            </el-button-group>
          </slot>
        </easy-table>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" top="5vh" width="50%"
               :title="dialogTitle"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="false"
               :close-on-click-modal="false"
               class="risk-rule-dialog">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="维度类型" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.dime_type_code" :disabled="dialogType==='edit'"
                           :data="userDimensions" value-type="String" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="市场编号" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.exch_no" :disabled="dialogType==='edit'" dict="exch_no"
                           value-type="Number" :show-all="false">
              </easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="币对代码" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.stock_code" :data="symbols" :show-all="false"
                           ref="stockCodeSelector"
                           @change="stockCodeChangeHandler">
              </easy-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="11">-->
            <!--<el-form-item label="币对名称" :label-width="formLabelWidth">-->
              <!--<el-input v-model="dialogFormData.stock_name" readonly ></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="11">
            <el-form-item label="基础币种" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.base_crncy_type" readonly ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="计价币种" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.quote_crncy_type" readonly ></el-input>
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

    <el-dialog :visible.sync="dimensionTypeDialogVisible" top="5vh" width="50%">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="维度类型编码" :label-width="formLabelWidth">
              <el-input v-model="dimensionTypeDialogFormData.dime_type_code" :disabled="dimensionTypeDialogType === 'edit'">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="维度类型名称" :label-width="formLabelWidth">
              <el-input v-model="dimensionTypeDialogFormData.dime_type_name" >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dimensionTypeDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary"  @click="doHandlerDimensionType">
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
      ...mapGetters('cache', ['filterSymbol'])
    },
    data() {
      return {
        computedStyle: {},
        columns: [{
          title: '维度类型编码',
          name: 'dime_type_code'
        }, {
          title: '交易市场',
          name: 'exch_no',
          formatter(row, column, cellValue) {
            return this.translateDict('exch_no', cellValue)
          }
        }, {
          title: '币对名称',
          name: 'stock_name'
        }, {
          title: '基础币种',
          name: 'base_crncy_type'
        }, {
          title: '计价币种',
          name: 'quote_crncy_type'
        }],
        dimensionType: 1,
        dimensionTypeData: [],
        dimensionTypeDialogTitle: '',
        dimensionTypeDialogVisible: false,
        dimensionTypeDialogType: 'add',
        dimensionTypeDialogFormData: {},
        dialogVisible: false,
        dialogTitle: '',
        dialogType: '',
        dialogFormData: {},
        dimenTypeCodes: [],
        formLabelWidth: '105px',
        selectedDimenType: null,
        selectedDimenTypeCode: '',
        selectedRow: null
      }
    },
    methods: {
      addHandler() {
        this.dialogType = 'add'
        this.dialogTitle = '新增维度币对代码'
        this.dialogVisible = true
        this.dialogFormData = {
          dime_type_code: this.selectedDimenTypeCode,
          exch_no: 1
        }
      },
      addDimensionTypeHandler () {
        this.dimensionTypeDialogType = 'add'
        this.dimensionTypeDialogVisible = true
      },
      deleteHandler() {
        this.$confirm('您确定删除此维度币对代码吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.3.8.json', {
            dime_type_code: this.selectedRow.dime_type_code,
            exch_no: this.selectedRow.exch_no,
            stock_code: this.selectedRow.stock_code
          }).then(resp => {
            this.$message.success('删除成功')
            this.queryDimensionStock()
          })
        })
      },
      deleteDimensionTypeHandler () {
        this.$confirm('您确定删除此维度类型吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('rksecuL.3.5.json', {
            dime_type_code: this.selectedDimenTypeCode
          }).then(resp => {
            this.$message.success('删除成功')
            this.queryCustomDimensionType(this.dimensionType)
          })
        }, () => {return})
      },
      doHandlerDimensionType () {
        if (this.dimensionTypeDialogType === 'add') {
          // 新增机构维度类型
          this.$post('rksecuL.3.3.json', {
            user_dim_type: 3,
            dime_type_code: this.dimensionTypeDialogFormData.dime_type_code,
            dime_type_name: this.dimensionTypeDialogFormData.dime_type_name
          }).then(resp => {
            this.$message.success('增加成功')
            this.dimensionTypeDialogVisible = false
            this.queryCustomDimensionType(this.dimensionType)
          })
        } else if (this.dimensionTypeDialogType === 'edit') {
          // 新增机构维度类型
          this.$post('rksecuL.3.4.json', {
            user_dim_type: 3,
            dime_type_code: this.dimensionTypeDialogFormData.dime_type_code,
            dime_type_name: this.dimensionTypeDialogFormData.dime_type_name
          }).then(resp => {
            this.$message.success('增加成功')
            this.dimensionTypeDialogVisible = false
            this.queryCustomDimensionType(this.dimensionType)
          })
        }
      },
      doHandler () {
        if (this.dialogType === 'add') {
          this.$post('rksecuL.3.7.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.$message.success('增加成功')
            this.dialogVisible = false
            this.queryDimensionStock()
          })
        }
      },
      editDimensionTypeHandler () {
        this.dimensionTypeDialogType = 'edit'
        this.dimensionTypeDialogVisible = true
        this.dimensionTypeDialogFormData = this.selectedDimenType
      },
      queryCustomDimensionType (dimensionType) {
        if (dimensionType === 1) {
          this.$post('rksecuL.3.1.json').then(resp => {
            this.dimensionTypeData = resp
          })
        } else if (dimensionType === 2) {
          this.$post('rksecuL.3.6.json').then(resp => {
            this.dimensionTypeData = resp
          })
        }
        this.queryDimensionStock()
      },
      queryDimensionStock () {
        // 系统自定义
        if (this.dimensionType === 1) {
          this.$post('rksecuL.3.2.json', {
            dime_type_code: this.selectedDimenTypeCode
          }).then(resp => {
            this.dimenTypeCodes = resp
          })
        } else if (this.dimensionType === 2){ //机构自定义
          this.$post('rksecuL.3.9.json', {
            dime_type_code: this.selectedDimenTypeCode
          }).then(resp => {
            this.dimenTypeCodes = resp
          })
        }
      },
      setSelectedDimenTypeCode(event, data) {
        this.selectedDimenType = data
        this.selectedDimenTypeCode = data.dime_type_code
        this.queryDimensionStock()
      },
      stockCodeChangeHandler (val) {
        let symbol = this.filterSymbol(val)[0]
        this.dialogFormData.stock_name = symbol.label
        this.dialogFormData.base_crncy_type = symbol.base_crncy_type
        this.dialogFormData.quote_crncy_type = symbol.quote_crncy_type
      }
    },
    mounted() {
      let height = document.querySelector('.el-main').clientHeight
      this.computedStyle = {
        height: height - 45
      }
      this.queryCustomDimensionType(this.dimensionType)
      this.queryDimensionStock()
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
</style>
