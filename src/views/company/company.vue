<!--机构管理-->
<template>
  <div>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group>
          <el-button type="primary" size="small" @click="editHandler">修改</el-button>
        </el-button-group>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="searchCoInfo" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
    <el-dialog top="5vh" :title="dialogTitle" :visible.sync="dialogFormVisible" :append-to-body="true" :modal-append-to-body="true" :lock-scroll="false"
               :close-on-click-modal="false">
      <el-form :data="dialogFormData">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="机构编号" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.co_no" auto-complete="off" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="机构名称" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.co_name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="联系人" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.conta_name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.phone_number" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="联系地址" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.conta_addr" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="资产币种" :label-width="formLabelWidth">
              <easy-select v-model="dialogFormData.crncy_type" dict="crncy_type" value-type="String" :show-all="false"></easy-select>
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
          co_no: 0,
          co_status: ' '
        },
        tableData: [],
        dialogFormVisible: false,
        dialogTitle: '修改机构',
        dialogFormData: {},
        formLabelWidth: '85px',
        tableColumns: [{
          name: 'co_no',
          title: '机构编号',
          width: 100,
          headerAlign: 'left',
          align: 'left'
        }, {
          name: 'co_name',
          title: '机构名称',
          width: 100
        }, {
          name: 'co_status',
          title: '机构状态',
          width: 120,
          formatter (row, column, cellValue) {
            return this.translateDict('co_status', cellValue)
          }
        }, {
          name: 'pd_qty_max',
          title: '机构账户数量上限',
          width: 130
        }, {
          name: 'max_acco_count',
          title: '业务账户数量上限'
        }, {
          name: 'opor_qty_max',
          title: '操作员数量上限'
        }, {
          name: 'conta_name',
          title: '联系人'
        }, {
          name: 'phone_number',
          title: '联系电话'
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
        allCompanys: state => state.companys
      })
    },
    mounted () {
      this.searchCoInfo()
    },
    methods: {
      searchCoInfo() {
        this.$post('pubL.17.18.json').then(resp => {
          this.tableData = resp
        })
      },
      editHandler () {
        this.dialogFormVisible = true
        let data = this.tableData[0]
        this.dialogFormData = {
          co_no: data.co_no,
          conta_name:  data.conta_name,
          conta_addr: data.conta_addr,
          phone_number: data.phone_number,
          co_name: data.co_name,
          crncy_type: data.crncy_type
        }
      },
      doHandler() {
        this.$post('pubL.17.12.json', {
          ...this.dialogFormData
        }).then(resp => {
          this.dialogFormVisible = false
          this.$message.success('修改机构成功')
          this.searchCoInfo()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
