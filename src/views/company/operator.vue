<!--操作员管理-->
<template>
  <div>
    <table-search @submit="searchOporInfo">
      <slot>
        <el-form-item label="操作员名称">
          <easy-select v-model="formData.query_opor_no" value-type="Number" style="width: 150px" :data="allOperators"></easy-select>
        </el-form-item>
        <el-form-item label="操作员状态">
          <easy-select v-model="formData.opor_status" dict="opor_status" style="width: 150px" value-type="String"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <el-row>
      <el-col :span="8" v-if="leftPanelVisibel">
        <privilege-panel style="margin: 14px 10px" :opor-no="selectedRow && selectedRow.opor_no" @cancel="leftPanelVisibel = !leftPanelVisibel"></privilege-panel>
      </el-col>
      <el-col :span="leftPanelVisibel ? 16 : 24">
        <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}"
                    ref="table">
          <slot>
            <el-button-group>
              <el-button @click="addHandler" size="small">新增</el-button>
              <el-button type="primary" size="small" :disabled="selectedRow === null"
                         @click="editHandler">修改
              </el-button>
            </el-button-group>
            <el-button type="success" size="small" :disabled="selectedRow === null || selectedRow.opor_no === user.operator_no"
                       @click="resetPwdHandler">重置密码
            </el-button>
            <el-button-group>
              <el-button type="info" size="small"
                         :disabled="selectedRow === null || selectedRow.opor_no === user.operator_no || selectedRow.opor_status !== '1'"
                         @click="frozenHandler">冻结
              </el-button>
              <el-button type="warning" size="small"
                         :disabled="selectedRow === null || selectedRow.opor_no === user.operator_no || selectedRow.opor_status !== '2'"
                         @click="unfrozenHandler">解冻
              </el-button>
              <el-button type="danger" size="small"
                         :disabled="selectedRow === null || selectedRow.opor_no === user.operator_no || selectedRow.opor_status === '3'"
                         @click="logoutHandler">注销
              </el-button>
            </el-button-group>
            <el-button-group>
              <el-button type="primary" @click="privilegeHandler" :disabled="selectedRow === null">设置账户权限</el-button>
            </el-button-group>
            <el-button-group class="btn-right">
              <el-button type="primary" size="small" @click="searchOporInfo" icon="el-icon-refresh">刷新</el-button>
            </el-button-group>
          </slot>
        </easy-table>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :append-to-body="true"
               :modal-append-to-body="true" :lock-scroll="false"
               top="5vh"
               :close-on-click-modal="false">
      <el-form :data="dialogFormData" ref="form" :model="dialogFormData" >
        <template v-if="dialogType === 'add' || dialogType === 'edit'">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="机构编号" :label-width="formLabelWidth">
                <el-input :value="user.company_no" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="操作员编号" :label-width="formLabelWidth">
                <el-input v-model="target_opor_no" auto-complete="off" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="操作员姓名" :label-width="formLabelWidth" prop="opor_name"
                            :rules="[{required: true, message: '操作员名称不能为空'}]">
                <el-input v-model="dialogFormData.opor_name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="允许登录终端" :label-width="formLabelWidth" >
                <easy-select v-model="dialogFormData.allow_login_type" dict="oper_way" value-type="String"
                             :multiple="true" :show-all="false"></easy-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-show="dialogType==='add'">
            <el-col :span="11">
              <el-form-item label="操作员密码" :label-width="formLabelWidth" >
                <el-input v-model="dialogFormData.target_opor_pwd" type="password" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="重复密码" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.target_opor_pwd" type="password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="联系电话" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.phone_number" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="Email" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="联系地址" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.conta_addr" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="dialogType === 'reset'">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="操作员编号" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.target_opor_no" auto-complete="off" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="操作员姓名" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.opor_name" auto-complete="off" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.opor_new_pwd" auto-complete="off" type="password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="重复密码" :label-width="formLabelWidth">
                <el-input v-model="dialogFormData.opor_new_pwd" auto-complete="off" type="password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {Button, ButtonGroup, Col, Dialog, Form, FormItem, Input, Row, Select, Tabs, TabPane, Option} from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import {mapGetters, mapState} from 'vuex'
import {base64, md5} from '@/tools/index'
import EasyTable from '@/components/EasyTable'
import EasySelect from '@/components/EasySelect'
import TableSearch from '@/components/TableSearch'
import PrivilegePanel from '@/views/comps/privilege-panel'
export default {
  data () {
    return {
      formData: {
        query_opor_no: 0,
        opor_status: ' '
      },
      leftPanelVisibel: false,
      tableData: [],
      selectData: [],
      selectedRow: null,
      dialogFormVisible: false,
      dialogTitle: '',
      dialogType: 'add',
      dialogFormData: {},
      target_opor_no: null,
      formLabelWidth: '96px',
      tableColumns: [{
        name: 'co_no',
        title: '机构编号',
        sortable: true
      }, {
        name: 'opor_no',
        title: '操作员编号'
      }, {
        name: 'opor_name',
        title: '操作员名称'
      }, {
        name: 'opor_status',
        title: '操作员状态',
        formatter (row, column, cellValue) {
          return this.translateDict('opor_status', cellValue)
        },
        sortable: true
      }, {
        name: 'allow_login_type',
        title: '允许登录终端',
        formatter (row, column, cellValue) {
          let values = cellValue.split(';').map(value => {
            return this.translateDict('oper_way', value)
          })
          return values.join(',')
        }
      }, {
        name: 'phone_number',
        title: '联系电话'
      }, {
        name: 'email',
        title: 'Email'
      }, {
        name: 'conta_addr',
        title: '联系地址'
      }]
    }
  },
  components: {
    'el-button': Button,
    'el-button-group': ButtonGroup,
    'el-col': Col,
    'el-collapse-transition': CollapseTransition,
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-row': Row,
    'el-select': Select,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-option': Option,
    EasySelect,
    EasyTable,
    PrivilegePanel,
    TableSearch
  },
  computed: {
    ...mapGetters('dict', ['getDictByName']),
    ...mapState('login', {
      user: state => state.user
    }),
    ...mapState('cache', {
      allCompanys: state => state.companys,
      allOperators: state => state.operators
    })
  },
  mounted () {
    this.searchOporInfo()
  },
  methods: {
    searchOporInfo () {
      this.$post('pubL.19.4.json', {
        query_opor_no: this.formData.query_opor_no,
        opor_status_str: this.formData.opor_status,
        row_count: -1
      }).then(resp => {
        this.tableData = resp
      })
    },
    getOporNo () {
      return this.$post('pubL.19.14.json', {
        co_no: this.user.company_no,
      })
    },
    addHandler (event) {
      this.getOporNo().then(resp => {
        this.target_opor_no = resp.target_opor_no
        this.dialogFormData ={
          target_opor_no: resp.target_opor_no,
          allow_login_type: []
        }
        this.dialogTitle = '新增操作员'
        this.dialogType = 'add'
        this.dialogFormVisible = true
      })
    },
    doHandler () {
      let data = this.dialogFormData
      if (this.dialogType === 'add') {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$post('pubL.19.1.json', {
              ...this.dialogFormData,
              target_opor_pwd: base64.encode(md5(data.taget_opor_no + '#' + data.target_opor_pwd)),
              allow_login_type: data.allow_login_type.join(';')
            }).then(resp => {
              this.dialogFormVisible = false
              this.$message.success('新增操作员成功')
              this.searchOporInfo()
            })
          }
        })

      } else if (this.dialogType === 'edit') {
        this.$post('pubL.19.2.json', {
          ...this.dialogFormData,
          allow_login_type: data.allow_login_type.join(';')
        }).then(resp => {
          this.dialogFormVisible = false
          this.$message.success('修改操作员成功')
          this.searchOporInfo()
        })
      } else if (this.dialogType === 'reset') {
        this.$post('pubL.19.10.json', {
          ...this.dialogFormData,
          opor_new_pwd: base64.encode(md5(data.target_opor_no + '#' + data.opor_new_pwd)),
        }).then(resp => {
          this.dialogFormVisible = false
          this.$message.success('重置操作员密码成功')
        })
      }
    },
    editHandler () {
      this.dialogTitle = '修改操作员'
      this.dialogFormData = {
        co_no: this.selectedRow.co_no,
        conta_addr: this.selectedRow.conta_addr,
        opor_name: this.selectedRow.opor_name,
        email: this.selectedRow.email,
        target_opor_no: this.selectedRow.opor_no,
        opor_status: this.selectedRow.opor_status,
        phone_number: this.selectedRow.phone_number,
        allow_login_type: this.selectedRow.allow_login_type.split(';')
      }
      this.target_opor_no = this.dialogFormData.target_opor_no
      this.dialogType = 'edit'
      this.dialogFormVisible = true
    },
    resetPwdHandler () {
      this.dialogTitle = '重置密码'
      this.dialogType = 'reset'
      this.dialogFormVisible = true
      this.dialogFormData = {
        target_opor_no: this.selectedRow.opor_no,
        opor_name: this.selectedRow.opor_name
      }
    },
    frozenHandler () {
      this.$confirm('您确定冻结此操作员吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('pubL.19.5.json', {
          target_opor_no: this.selectedRow.opor_no
        }).then(resp => {
          this.$message.success('冻结成功')
          this.searchOporInfo()
        })
      })
    },
    unfrozenHandler () {
      this.$confirm('您确定解冻此操作员吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('pubL.19.6.json', {
          target_opor_no: this.selectedRow.opor_no
        }).then(resp => {
          this.$message.success('解冻成功')
          this.searchOporInfo()
        })
      })
    },
    logoutHandler () {
      this.$confirm('您确定注销此操作员吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('pubL.19.7.json', {
          target_opor_no: this.selectedRow.opor_no
        }).then(resp => {
          this.$message.success('注销成功')
          this.searchOporInfo()
        })
      })
    },
    privilegeHandler () {
      this.leftPanelVisibel = !this.leftPanelVisibel
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
