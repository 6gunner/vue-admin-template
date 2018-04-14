<!--交易账户-->
<template>
  <div>
    <table-search @submit="searchTradeInfo">
      <slot>
        <el-form-item label="机构账户名称">
          <easy-select v-model="formData.pd_no" value-type="Number" style="width: 150px" :data="allProducts" ></easy-select>
        </el-form-item>
        <el-form-item label="交易账户名称">
          <easy-select v-model="formData.exch_group_no" value-type="Number" style="width: 150px" :data="allExchGroups" ></easy-select>
        </el-form-item>
        <el-form-item label="交易账户状态">
          <easy-select v-model="formData.exch_group_status" dict="exch_group_status" value-type="String" style="width: 150px"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group>
          <el-button @click="addHandler" size="small">新增</el-button>
          <el-button type="primary" size="small" :disabled="selectedRow === null || selectedRow.exch_group_status === '3'" @click="editHandler">修改</el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="info" size="small" :disabled="selectedRow === null || selectedRow.exch_group_status !== '1'" @click="frozenHandler">冻结</el-button>
          <el-button type="warning" size="small" :disabled="selectedRow === null || selectedRow.exch_group_status !== '2'" @click="unfrozenHandler">解冻</el-button>
          <el-button type="danger" size="small" :disabled="selectedRow === null || selectedRow.exch_group_status === '3'" @click="logoutHandler">注销</el-button>
        </el-button-group>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="searchTradeInfo" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :append-to-body="true" :modal-append-to-body="true" :lock-scroll="false"
               top="5vh"
               :close-on-click-modal="false">
      <el-form :data="dialogFormData" ref="form" :model="dialogFormData">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="机构编号" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.co_no" disabled size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="机构账户" :label-width="formLabelWidth" prop="pd_no"
                          :rules="[{required: true, message: '机构账户不能为空'}]">
              <easy-select v-model="dialogFormData.pd_no" @change="()=>{$refs['assetAccountSelector'].clear()}" auto-complete="off" :disabled="dialogType==='edit'" :data="avaliableProducts" value-type="Number" :showAll="false"></easy-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="业务账户" :label-width="formLabelWidth" prop="asset_acco_no"
                          :rules="[{required: true, message: '业务账户不能为空'}]">
              <easy-select v-model="dialogFormData.asset_acco_no" ref="assetAccountSelector" :data="filterAssets(dialogFormData.pd_no)" value-type="Number" :showAll="false" :disabled="dialogType==='edit'"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交易账户编码" :label-width="formLabelWidth" >
              <el-input v-model="dialogFormData.exch_group_code" value-type="String" size="small" :disabled="dialogType==='edit'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="交易账户名称" :label-width="formLabelWidth" >
              <el-input v-model="dialogFormData.exch_group_name" value-type="String" size="small" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="允许提币" :label-width="formLabelWidth" >
              <easy-select v-model="dialogFormData.wtdraw_crncy_perm" dict="wtdraw_crncy_perm" value-type="Number" :showAll="false" ></easy-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="成本资产" :label-width="formLabelWidth" >
              <el-input v-model="dialogFormData.first_asset" value-type="String" size="small" ></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
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
  import {format} from '@/tools/index'

  export default {
    data () {
      return {
        formData: {
          pd_no: 0,
          pd_status: ' '
        },
        tableData: [],
        selectedRow: null,
        dialogFormVisible: false,
        dialogType: 'add',
        dialogTitle: '',
        dialogFormData: {
        },
        formLabelWidth: '98px',
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
          name: 'asset_acco_name',
          title: '业务账户名称'
        }, {
          name: 'exch_group_code',
          title: '交易账户编码'
        }, {
          name: 'exch_group_name',
          title: '交易账户名称'
        }, {
          name: 'exch_group_status',
          title: '交易账户状态',
          formatter (row, column, cellValue) {
            return this.translateDict('exch_group_status', cellValue)
          }
        }, {
          name: 'wtdraw_crncy_perm',
          title: '允许提币',
          formatter (row, column, cellValue) {
            return this.translateDict('wtdraw_crncy_perm', cellValue)
          }
        },{
          name: 'first_asset',
          title: '成本资产',
          formatter(row, column, cellValue) {
            return format('number', '$0', cellValue)
          }
        }, {
          name: 'default_group_flag',
          title: '是否默认账户',
          formatter (row, column, cellValue) {
            return this.translateDict('default_group_flag', cellValue)
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
        allChannels: state => state.channels,
        allAssets: state => state.assets,
        allExchGroups: state => state.exchGroups
      }),
      ...mapGetters('cache', ['avaliableProducts', 'avaliableAssets', 'avaliableExchGroups', 'filterCoAccounts', 'filterAssets', 'filterExchGroups'])
    },
    mounted () {
      this.searchTradeInfo()
    },
    methods: {
      searchTradeInfo() {
        this.$post('prodL.1.83.json', {
          pd_no: this.formData.pd_no,
          default_group_flag: 0,
          exch_group_no: this.formData.exch_group_no,
          exch_group_status_str: this.formData.exch_group_status,
          row_count: -1
        }).then(resp => {
          this.tableData = resp
        })
      },
      addHandler(event) {
        this.dialogFormData = {
          co_no : this.user.company_no,
          wtdraw_crncy_perm: 2
        }
        this.dialogTitle = '新增交易账户'
        this.dialogType = 'add'
        this.dialogFormVisible = true
      },
      doHandler() {
        if (this.dialogType === 'add') {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$post('prodL.1.81.json', {
                ...this.dialogFormData
              }).then(resp => {
                this.dialogFormVisible = false
                this.$message.success('新增交易账户成功')
                this.searchTradeInfo()
              })
            }
          })

        } else if(this.dialogType === 'edit'){
          this.$post('prodL.1.82.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('修改交易账户成功')
            this.searchTradeInfo()
          })
        }
      },
      editHandler() {
        this.dialogFormVisible = true
        this.dialogTitle = '修改交易账户'
        this.dialogFormData = {
          co_no: this.selectedRow.co_no,
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          exch_group_code: this.selectedRow.exch_group_code,
          exch_group_name: this.selectedRow.exch_group_name,
          wtdraw_crncy_perm: this.selectedRow.wtdraw_crncy_perm,
          first_asset: this.selectedRow.first_asset
        }
        this.dialogType = 'edit'
      },

      frozenHandler() {
        this.$confirm('您确定冻结此交易账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.84.json', {
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no,
            exch_group_no: this.selectedRow.exch_group_no
          }).then(resp => {
            this.$message.success('冻结成功')
            this.searchTradeInfo()
          })
        })
      },
      unfrozenHandler() {
        this.$confirm('您确定解冻此交易账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.85.json', {
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no,
            exch_group_no: this.selectedRow.exch_group_no
          }).then(resp => {
            this.$message.success('解冻成功')
            this.searchTradeInfo()
          })
        })
      },
      logoutHandler() {
        this.$confirm('您确定注销此交易账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.86.json', {
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no,
            exch_group_no: this.selectedRow.exch_group_no
          }).then(resp => {
            this.$message.success('注销成功')
            this.searchTradeInfo()
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>

