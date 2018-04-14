<!--机构账户账户-->
<template>
  <div>
    <table-search @submit="searchCoAccount">
      <slot>
        <el-form-item label="机构账户名称">
          <easy-select v-model="formData.pd_no" value-type="Number" style="width: 150px" :data="allProducts" ></easy-select>
        </el-form-item>
        <el-form-item label="机构账户状态">
          <easy-select v-model="formData.pd_status" dict="pd_status" value-type="String" style="width: 150px" ></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group>
          <el-button type="primary" size="small" :disabled="selectedRow === null || selectedRow.pd_status === '3'" @click="editHandler">修改</el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="info" size="small" :disabled="selectedRow === null || selectedRow.pd_status !== '1'" @click="frozenHandler">冻结</el-button>
          <el-button type="warning" size="small" :disabled="selectedRow === null || selectedRow.pd_status !== '2'" @click="unfrozenHandler">解冻</el-button>
        </el-button-group>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="searchCoAccount" icon="el-icon-refresh">刷新</el-button>
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
              <el-input v-model="dialogFormData.co_no" size="small" auto-complete="off" :autofocus="true" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="账户编码" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.pd_code" size="small" auto-complete="off" :disabled="dialogType==='edit'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="账户名称" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.pd_name" size="small" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="本币币种" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.crncy_type" dict="crncy_type" value-type="String" :showAll="false"></easy-select>
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
  import { Button, ButtonGroup, Col, Dialog, Form, FormItem, Input, Row, Select, Option } from 'element-ui'
  import { mapGetters, mapState } from 'vuex'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import TableSearch from '@/components/TableSearch'
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
        formLabelWidth: '85px',
        tableColumns: [{
          name: 'co_no',
          title: '机构编号',
          width: 100
        }, {
          name: 'co_name',
          title: '机构名称',
          width: 100
        }, {
          name: 'pd_no',
          title: '机构账户编号'
        }, {
          name: 'pd_code',
          title: '机构账户编码'
        }, {
          name: 'pd_name',
          title: '机构账户名称'
        }, {
          name: 'pd_status',
          title: '机构账户状态',
          formatter (row, column, cellValue) {
            return this.translateDict('pd_status', cellValue)
          },
          sortable: true
        }, {
          name: 'crncy_type',
          title: '资产币种',
          formatter (row, column, cellValue) {
            return this.translateDict('crncy_type', cellValue)
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
        allProducts: state => state.products
      })
    },
    mounted () {
      this.searchCoAccount()
    },
    methods: {
      searchCoAccount() {
        this.$post('prodL.1.4.json', {
          pd_no: this.formData.pd_no,
          pd_status_str: this.formData.pd_status,
          row_count: -1
        }).then(resp => {
          this.tableData = resp
        })
      },
      doHandler() {
        if (this.dialogType === 'add') {
          // this.$post('prodL.1.1.json', {
          //   ...this.dialogFormData
          // }).then(resp => {
          //   this.dialogFormVisible = false
          //   this.$message.success('新增机构账户成功')
          //   this.searchCoAccount()
          // })
        } else if(this.dialogType === 'edit'){
          this.$post('prodL.1.2.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('修改机构账户成功')
            this.searchCoAccount()
          })
        }
      },
      editHandler() {
        this.dialogFormVisible = true
        this.dialogTitle = '修改机构账户'
        this.dialogFormData = this.selectedRow
        this.dialogType = 'edit'
      },
      frozenHandler() {
        this.$confirm('您确定冻结此机构账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.8.json', {
            pd_no: this.selectedRow.pd_no
          }).then(resp => {
            this.$message.success('冻结成功')
            this.searchCoAccount()
          })
        })
      },
      unfrozenHandler() {
        this.$confirm('您确定解冻此机构账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.9.json', {
            pd_no: this.selectedRow.pd_no
          }).then(resp => {
            this.$message.success('解冻成功')
            this.searchCoAccount()
          })
        })
      }
      // logoutHandler() {
      //   this.$post('prodL.1.10.json', {
      //     pd_no: this.selectedRow.pd_no
      //   }).then(resp => {
      //     this.$message.success('注销成功')
      //     this.searchCoAccount()
      //   })
      // }
    }
  }
</script>
<style lang="scss" scoped>

</style>

