<!--业务账户-->
<template>
  <div>
    <table-search @submit="searchAssetsInfo">
      <slot>
        <el-form-item label="机构账户名称">
          <easy-select v-model="formData.pd_no" value-type="Number" style="width: 150px" :data="allProducts" ></easy-select>
        </el-form-item>
        <el-form-item label="业务账户名称">
          <easy-select v-model="formData.asset_acco_no" value-type="Number" style="width: 150px" :data="allAssets" ></easy-select>
        </el-form-item>
        <el-form-item label="业务账户状态">
          <easy-select v-model="formData.asset_acco_status" dict="asset_acco_status" value-type="String" style="width: 150px"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group>
          <el-button type="primary" size="small" :disabled="selectedRow === null || selectedRow.asset_acco_status === '3'" @click="editHandler">修改</el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="info" size="small" :disabled="selectedRow === null || selectedRow.asset_acco_status !== '1'" @click="frozenHandler">冻结</el-button>
          <el-button type="warning" size="small" :disabled="selectedRow === null || selectedRow.asset_acco_status !== '2'" @click="unfrozenHandler">解冻</el-button>
        </el-button-group>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="searchAssetsInfo" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :append-to-body="true" :modal-append-to-body="true" :lock-scroll="false"
               top="5vh"
               :close-on-click-modal="false">
      <el-form :data="dialogFormData">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="机构编号" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.co_no" disabled size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="机构账户" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.pd_no" auto-complete="off" :disabled="dialogType==='edit'" :data="allProducts" value-type="Number"></easy-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="账户编码" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.asset_acco" value-type="String" size="small" :disabled="dialogType==='edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="账户名称" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.asset_acco_name" value-type="String" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="账户类型" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.asset_acco_type" dict="asset_acco_type" value-type="Number" :showAll="false" :disabled="dialogType==='edit'"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="通道编号" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.pass_no"  value-type="Number" size="small" :data="allChannels" :showAll="false" :disabled="dialogType==='edit'"></easy-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="dialogType==='add'">
          <el-col :span="11">
            <el-form-item label="外部账号" :label-width="formLabelWidth">
              <el-tooltip content="火币的账户ID" placement="top">
                <el-input v-model="dialogFormData.out_acco" auto-complete="off" size="small" ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="访问秘钥" :label-width="formLabelWidth">
              <el-tooltip content="火币API的访问秘钥" placement="top">
                <el-input v-model="dialogFormData.trade_pwd" auto-complete="off" size="small"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="dialogType==='add'">
          <el-col :span="11">
            <el-form-item label="私密秘钥" :label-width="formLabelWidth">
              <el-tooltip content="火币API的私密秘钥" placement="top">
                <el-input v-model="dialogFormData.comm_pwd" auto-complete="off" size="small"></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { Button, ButtonGroup, Col, Dialog, Form, FormItem, Input, Row, Select, Tooltip, Option } from 'element-ui'
  import { mapGetters, mapState } from 'vuex'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import TableSearch from '@/components/TableSearch'
  export default {
    data () {
      return {
        formData: {
          pd_no: 0,
          asset_acco_no: 0,
          asset_acco_status: ' '
        },
        tableData: [],
        selectedRow: null,
        dialogFormVisible: false,
        dialogType: 'add',
        dialogTitle: '',
        dialogFormData: {
        },
        formLabelWidth: '85px',
        tableColumns: [{
          name: 'co_no',
          title: '机构编号'
        }, {
          name: 'co_name',
          title: '机构名称'
        }, {
          name: 'pd_name',
          title: '机构账户名称'
        }, {
          name: 'asset_acco',
          title: '业务账户编码'
        }, {
          name: 'asset_acco_name',
          title: '业务账户名称'
        }, {
          name: 'asset_acco_type',
          title: '业务账户类型',
          formatter (row, column, cellValue) {
            return this.translateDict('asset_acco_type', cellValue)
          }
        }, {
          name: 'pass_no',
          title: '通道编号'
        }, {
          name: 'pass_name',
          title: '通道名称'
        }, {
          name: 'out_acco',
          title: '外部账号'
        },{
          name: 'asset_acco_status',
          title: '业务账户状态',
          formatter (row, column, cellValue) {
            return this.translateDict('asset_acco_status', cellValue)
          }
        }]
      }
    },
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup,
      'el-col': Col,
      'el-dialog': Dialog,
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
        allAssets: state => state.assets,
        allChannels: state => state.channels
      })
    },
    mounted () {
      this.searchAssetsInfo()
    },
    methods: {
      searchAssetsInfo() {
        this.$post('prodL.1.44.json', {
          pd_no: this.formData.pd_no,
          asset_acco_no: this.formData.asset_acco_no,
          asset_acco_status_str: this.formData.asset_acco_status,
          asset_acco_type: 0,
          row_count: -1
        }).then(resp => {
          this.tableData = resp
        })
      },
      addHandler(event) {
        this.dialogFormData.co_no = this.user.company_no
        this.dialogTitle = '新增业务账户'
        this.dialogType = 'add'
        this.dialogFormVisible = true
      },
      doHandler() {
        if (this.dialogType === 'add') {
          this.$post('prodL.1.41.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('新增业务账户成功')
            this.searchAssetsInfo()
          })
        } else if(this.dialogType === 'edit'){
          this.$post('prodL.1.42.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('修改业务账户成功')
            this.searchAssetsInfo()
          })
        }
      },
      editHandler() {
        this.dialogFormVisible = true
        this.dialogTitle = '修改业务账户'
        this.dialogFormData = {
          co_no: this.selectedRow.co_no,
          pd_no: this.selectedRow.pd_no,
          asset_acco: this.selectedRow.asset_acco,
          asset_acco_name: this.selectedRow.asset_acco_name,
          asset_acco_type: this.selectedRow.asset_acco_type,
          pass_no: this.selectedRow.pass_no,
          asset_acco_no: this.selectedRow.asset_acco_no
        }
        this.dialogType = 'edit'
      },

      frozenHandler() {
        this.$confirm('您确定冻结此业务账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.47.json', {
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no
          }).then(resp => {
            this.$message.success('冻结成功')
            this.searchAssetsInfo()
          })
        })
      },
      unfrozenHandler() {
        this.$confirm('您确定解冻此业务账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.48.json', {
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no
          }).then(resp => {
            this.$message.success('解冻成功')
            this.searchAssetsInfo()
          })
        })
      },
      logoutHandler() {
        this.$confirm('您确定注销此业务账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.49.json', {
            asset_acco_no: this.selectedRow.asset_acco_no
          }).then(resp => {
            this.$message.success('注销成功')
            this.searchAssetsInfo()
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>

