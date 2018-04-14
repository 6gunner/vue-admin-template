<!--提币地址管理-->
<template>
  <div>
    <table-search @submit="searchAddressInfo">
      <slot>
        <el-form-item label="机构账户名称">
          <easy-select v-model="formData.pd_no" value-type="Number" :data="allProducts"
                       style="width: 150px"></easy-select>
        </el-form-item>
        <el-form-item label="业务账户名称">
          <easy-select v-model="formData.asset_acco_no" value-type="Number" :data="allAssets"
                       style="width: 150px"></easy-select>
        </el-form-item>
        <el-form-item label="交易账户名称">
          <easy-select v-model="formData.exch_group_no" value-type="Number" :data="allExchGroups"
                       style="width: 150px"></easy-select>
        </el-form-item>
        <el-form-item label="币种">
          <easy-select v-model="formData.base_crncy_type" dict="base_crncy_type" value-type="String"
                       style="width: 100px"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group>
          <el-button @click="addHandler" size="small">新增</el-button>
          <el-button type="primary" size="small"
                     :disabled="selectedRow === null || selectedRow.exch_group_status === '3'" @click="editHandler">修改
          </el-button>
          <el-button type="info" size="small" :disabled="selectedRow === null || selectedRow.exch_group_status !== '1'"
                     @click="deleteHandler">删除
          </el-button>
        </el-button-group>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="searchAddressInfo" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :append-to-body="true"
               :modal-append-to-body="true" :lock-scroll="false"
               top="5vh"
               :close-on-click-modal="false">
      <el-form :data="dialogFormData" ref="form" :model="dialogFormData">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="机构账户" :label-width="formLabelWidth" prop="pd_no"
                          :rules="[{required: true, message: '机构账户不能为空'}]">
              <easy-select v-model="dialogFormData.pd_no" ref="coAccountSelector"
                           :disabled="dialogType==='edit'" :data="avaliableProducts" value-type="Number"
                           :show-all="false" @change="()=>{$refs['assetAccountSelector'].clear()}"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="业务账户" :label-width="formLabelWidth" prop="asset_acco_no"
                          :rules="[{required: true, message: '业务账户不能为空'}]">
              <easy-select v-model="dialogFormData.asset_acco_no" ref="assetAccountSelector"
                           :disabled="dialogType==='edit'" :data="filterAssets(dialogFormData.pd_no)"
                           value-type="Number" :show-all="false"
                           @change="()=>{$refs['exchGroupsSelector'].clear()}"></easy-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="交易账户" :label-width="formLabelWidth" prop="exch_group_no"
                          :rules="[{required: true, message: '交易账户不能为空'}]">
              <easy-select v-model="dialogFormData.exch_group_no" ref="exchGroupsSelector"
                           :disabled="dialogType==='edit'"
                           :data="filterExchGroups(dialogFormData.pd_no,dialogFormData.asset_acco_no)"
                           value-type="Number" :show-all="false"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交易市场" :label-width="formLabelWidth" prop="exch_no"
                          :rules="[{required: true, message: '交易市场不能为空'}]">
              <easy-select v-model="dialogFormData.exch_no" dict="exch_no" value-type="Number"
                           :disabled="dialogType==='edit'" :show-all="false"></easy-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="提币币种" :label-width="formLabelWidth" prop="base_crncy_type"
                          :rules="[{required: true, message: '提币币种不能为空'}]">
              <easy-select v-model="dialogFormData.base_crncy_type" dict="base_crncy_type" value-type="String"
                           :disabled="dialogType==='edit'" :show-all="false"></easy-select>
            </el-form-item>
          </el-col>

          <el-col :span="11">
            <el-form-item label="地址名称" :label-width="formLabelWidth" prop="addr_name"
                          :rules="[{required: true, message: '地址名称不能为空'}]">
              <el-input v-model="dialogFormData.addr_name" value-type="String"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="提币地址" :label-width="formLabelWidth" prop="wtdraw_crncy_addr"
                          :rules="[{required: true, message: '提币地址不能为空'}]">
              <el-input v-model="dialogFormData.wtdraw_crncy_addr" value-type="String"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

          <el-col :span="11">
            <el-form-item label="单笔限额" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.single_qty_limit" value-type="Number"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="地址标签" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.addr_tag" value-type="String"
              ></el-input>
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
  import {Button, ButtonGroup, Col, Dialog, Form, FormItem, Input, Row, Select, Tooltip, Option} from 'element-ui'
  import {mapGetters, mapState} from 'vuex'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import TableSearch from '@/components/TableSearch'
  import {format} from '@/tools/index'

  export default {
    data() {
      return {
        formData: {
          pd_no: 0,
          asset_acco_no: 0,
          exch_group_no: 0,
          base_crncy_type: ' '
        },
        tableData: [],
        selectedRow: null,
        dialogFormVisible: false,
        dialogType: 'add',
        dialogTitle: '',
        dialogFormData: {},
        formLabelWidth: '98px',
        tableColumns: [{
          name: 'pd_name',
          title: '机构账户名称'
        }, {
          name: 'asset_acco_name',
          title: '业务账户名称'
        }, {
          name: 'exch_group_name',
          title: '交易账户名称'
        }, {
          name: 'exch_name',
          title: '交易市场'
        }, {
          name: 'base_crncy_type',
          title: '提币币种'
        }, {
          name: 'addr_name',
          title: '地址名称'
        }, {
          name: 'addr_tag',
          title: '地址标签'
        }, {
          name: 'wtdraw_crncy_addr',
          title: '提币地址'
        }, {
          name: 'single_qty_limit',
          title: '单笔限额',
          formatter(row, column, cellValue) {
            return format('number', '$0', cellValue)
          }
        }

          //   {
          //   name: 'exch_group_status',
          //   title: '交易账户状态',
          //   formatter (row, column, cellValue) {
          //     return this.translateDict('exch_group_status', cellValue)
          //   }
          // }, {
          //   name: 'default_group_flag',
          //   title: '是否默认账户',
          //   formatter (row, column, cellValue) {
          //     return this.translateDict('default_group_flag', cellValue)
          //   }
          // }


        ]
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
        allExchGroups: state => state.exchGroups
      }),
      ...mapGetters('cache', ['avaliableProducts', 'avaliableAssets', 'avaliableExchGroups', 'filterCoAccounts', 'filterAssets', 'filterExchGroups'])
    },
    mounted() {
      this.searchAddressInfo()
    },
    methods: {
      searchAddressInfo() {
        this.$post('prodL.1.94.json', {
          pd_no: this.formData.pd_no,
          asset_acco_no: this.formData.asset_acco_no,
          exch_group_no: this.formData.exch_group_no,
          base_crncy_type: this.formData.base_crncy_type,
          row_count: -1
        }).then(resp => {
          this.tableData = resp
        })
      },
      addHandler(event) {
        this.dialogFormData = {}
        this.dialogTitle = '新增提币地址'
        this.dialogType = 'add'
        this.dialogFormVisible = true
      },
      editHandler() {
        this.dialogFormVisible = true
        this.dialogTitle = '修改提币地址'
        this.dialogFormData = {
          row_id: this.selectedRow.row_id,
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          exch_no: this.selectedRow.exch_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          single_qty_limit: this.selectedRow.single_qty_limit,
          addr_name: this.selectedRow.addr_name,
          addr_tag: this.selectedRow.addr_tag,
          wtdraw_crncy_addr: this.selectedRow.wtdraw_crncy_addr
        }
        this.dialogType = 'edit'
      },
      doHandler() {
        if (this.dialogType === 'add') {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$post('prodL.1.91.json', {
                ...this.dialogFormData
              }).then(resp => {
                this.dialogFormVisible = false
                this.$message.success('新增提币地址成功')
                this.searchAddressInfo()
              })
            }
          })

        } else if (this.dialogType === 'edit') {
          this.$post('prodL.1.92.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('修改提币地址成功')
            this.searchAddressInfo()
          })
        }
      },

      deleteHandler() {
        this.$confirm('您确定删除提币地址：' + this.selectedRow.addr_name + ' 吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.93.json', {
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no,
            exch_group_no: this.selectedRow.exch_group_no,
            exch_no: this.selectedRow.exch_no,
            base_crncy_type: this.selectedRow.base_crncy_type,
            addr_name: this.selectedRow.addr_name
          }).then(resp => {
            this.$message.success('删除成功')
            this.searchAddressInfo()
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>

