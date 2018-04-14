<!--交易组持仓-->
<template>
  <div>
    <table-search @submit="searchExchGroupPosition">
      <slot>
        <el-form-item label="机构账户名称">
          <easy-select v-model="formData.pd_no" value-type="Number" style="width: 150px" :data="allProducts" ></easy-select>
        </el-form-item>
        <el-form-item label="交易账户名称">
          <easy-select v-model="formData.exch_group_no" value-type="Number" style="width: 150px" :data="allExchGroups" ></easy-select>
        </el-form-item>
        <el-form-item label="币种">
          <easy-select v-model="formData.base_crncy_type" dict="base_crncy_type" value-type="String" style="width: 100px"></easy-select>
        </el-form-item>
      </slot>
    </table-search>
    <easy-table :columns="tableColumns" :data="tableData" @current-change="(currentRow) => {selectedRow = currentRow}">
      <slot>
        <el-button-group>
          <el-button size="small" @click="transHandler">持仓划转</el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="info" size="small" :disabled="selectedRow === null" @click="frozenHandler">冻结</el-button>
          <el-button type="warning" size="small" :disabled="selectedRow === null" @click="cancelFrozen">取消冻结</el-button>
        </el-button-group>
        <el-button-group class="btn-right">
          <el-button size="small" type="primary" @click="searchExchGroupPosition" icon="el-icon-refresh">刷新</el-button>
        </el-button-group>
      </slot>
    </easy-table>
    <el-dialog top="5vh" :title="dialogTitle" :visible.sync="dialogFormVisible" :append-to-body="true" :modal-append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
      <template v-if="!dialogTableVisible">
        <el-form :data="dialogFormData">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="交易市场" :label-width="formLabelWidth" >
                <easy-select v-model="dialogFormData.exch_no" dict="exch_no" disabled></easy-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="机构账户" :label-width="formLabelWidth">
                <easy-select v-model="dialogFormData.pd_no" :data="avaliableProducts" value-type="Number" :show-all="false" @change="pdChangeHandler"></easy-select>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="dialogType === 'trans'">
            <el-row :gutter="20" >
              <el-col :span="11">
                <el-form-item label="业务账户" :label-width="formLabelWidth">
                  <easy-select v-model="dialogFormData.asset_acco_no" :disabled="dialogType==='edit'" :data="filterAssets(dialogFormData.pd_no)" value-type="Number" :show-all="false"></easy-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="变动币种" :label-width="formLabelWidth">
                  <easy-select v-model="dialogFormData.base_crncy_type" value-type="String" dict="base_crncy_type"></easy-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item label="源交易组账户" :label-width="formLabelWidth">
                  <easy-select v-model="dialogFormData.source_exgp_no" :data="avaliableExchGroups" value-type="Number" :show-all="false"></easy-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="源可用数量" :label-width="formLabelWidth">
                  <el-input :value="sourceAvaliableQty" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item label="目标交易账户" :label-width="formLabelWidth">
                  <easy-select v-model="dialogFormData.target_exch_group_no" :data="avaliableExchGroups" value-type="Number" :show-all="false"></easy-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="变动数量" :label-width="formLabelWidth">
                  <el-input v-model="dialogFormData.occur_qty" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-row :gutter="20" >
              <el-col :span="11">
                <el-form-item label="资产账户" :label-width="formLabelWidth">
                  <easy-select v-model="dialogFormData.asset_acco_no" :disabled="dialogType==='edit'" :data="filterAssets(dialogFormData.pd_no)" value-type="Number" :show-all="false" @change="assetAccoChangeHandler" ref="assetAccoSelector"></easy-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="交易组" :label-width="formLabelWidth">
                  <easy-select v-model="dialogFormData.exch_group_no" :data="filterExchGroups(dialogFormData.pd_no, dialogFormData.asset_acco_no)" value-type="Number" :show-all="false" ref="exchGroupSelector"></easy-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item label="变动币种" :label-width="formLabelWidth">
                  <easy-select v-model="dialogFormData.base_crncy_type" value-type="String" dict="base_crncy_type"></easy-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="变动数量" :label-width="formLabelWidth" >
                  <el-input v-model="dialogFormData.occur_qty" size="small" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="doHandler">确 定</el-button>
        </div>
      </template>
      <template v-else>
        <easy-table :columns="dialogTableColumns" :data="dialogTableData" :selection="false" ref="dialogTable" @current-change="(currentRow) => {selectedDialogRow = currentRow}">
          <slot>
            <el-button-group>
              <el-button type="danger" size="small" @click="doCancelFrozen" v-show="dialogTableType==='frozen'" :disabled="selectedDialogRow === null ||selectedDialogRow.jour_status === '2'">取消冻结</el-button>
              <el-button type="danger" size="small" @click="doCancelUnFrozen" v-show="dialogTableType==='unfrozen'" :disabled="selectedDialogRow ===null || selectedDialogRow.jour_status === '2'">取消解冻</el-button>
            </el-button-group>
            <el-button-group class="btn-right">
              <el-button type="primary" size="small" @click="refreshHandler">刷新</el-button>
            </el-button-group>
          </slot>
        </easy-table>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import _ from 'underscore'
  import { Button, ButtonGroup, Col, Dialog, DatePicker, Form, FormItem, Input, Row, Select, Tooltip, Option } from 'element-ui'
  import { mapGetters, mapState } from 'vuex'
  import { format } from '@/tools/index'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import TableSearch from '@/components/TableSearch'
  export default {
    data () {
      return {
        formData: {
          pd_no: 0,
          exch_group_no: 0,
          exch_no_str: ' ',
          base_crncy_type: ' '
        },
        tableData: [],
        selectedRow: null,
        selectedDialogRow: null,
        dialogFormVisible: false,
        dialogTableVisible: false,
        dialogType: 'add',
        dialogTableType: '',
        dialogTitle: '',
        dialogTableData: [],
        dialogTableColumns: [{
          name: 'opor_no',
          title: '操作员编号'
        }, {
          name: 'opor_name',
          title: '操作员名称'
        }, {
          name: 'pd_name',
          title: '机构账户名称'
        }, {
          name: 'asset_acco_name',
          title: '业务账户名称'
        }, {
          name: 'exch_group_name',
          title: '交易账户名称'
        }, {
          name: 'base_crncy_type',
          title: '冻结币种'
        }, {
          name: 'init_date',
          title: '冻结日期'
        }, {
          name: 'occur_qty',
          title: '冻结数量'
        }, {
          name: 'expire_date',
          title: '到期日期',
          formatter (row, column, cellValue) {
            return format('date', 'yyyy-MM-dd', cellValue)
          }
        }, {
          name: 'jour_status',
          title: '冻结状态',
          formatter (row, column, cellValue) {
            return this.translateDict('jour_status', cellValue)
          }
        }],
        dialogFormData: {},
        formLabelWidth: '105px',
        tableColumns: [{
          name: 'pd_name',
          title: '机构账户名称'
        },{
          name: 'asset_acco_name',
          title: '业务账户名称'
        }, {
          name: 'exch_group_name',
          title: '交易账户名称'
        }, {
          name: 'exch_no',
          title: '交易市场',
          formatter (row, column, cellValue) {
            return this.translateDict('exch_no', cellValue)
          }
        }, {
          name: 'base_crncy_type',
          title: '币种'
        }, {
          name: 'curr_qty',
          title: '当前数量'
        }, {
          title: '持仓数量',
          formatter (row, column ,cellValue) {
            // 当前数量+成交释放数量-成交占用
            return row.curr_qty - row.strike_capt_qty + row.strike_releas_qty
          }
        }, {
          title: '可用数量',
          formatter (row, column ,cellValue) {
            // 当前数量-冻结数量+解冻数量-成交占用数量+成交释放数量-交易占用
            return row.curr_qty - row.frozen_qty + row.unfroz_qty
              - row.trade_capt_qty - row.strike_capt_qty + row.strike_releas_qty
          }
        }, {
          name: 'frozen_qty',
          title: '冻结数量'
        }, {
          name: 'unfroz_qty',
          title: '解冻数量'
        }, {
          name: 'trade_capt_qty',
          title: '交易占用'
        }, {
          name: 'trade_releas_qty',
          title: '交易释放'
        }, {
          name: 'strike_capt_qty',
          title: '成交占用'
        }, {
          name: 'strike_releas_qty',
          title: '成交释放'
        }]
      }
    },
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup,
      'el-col': Col,
      'el-dialog': Dialog,
      'el-date-picker': DatePicker,
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
      ...mapGetters('cache', ['avaliableProducts', 'avaliableChannels', 'avaliableExchGroups', 'avaliableAssets', 'filterAssets', 'filterExchGroups']),
      sourceAvaliableQty() {
        let exchGroupNo = this.dialogFormData.source_exgp_no
        let baseCrncyType = this.dialogFormData.base_crncy_type
        let result = 0
        this.tableData.forEach((dataItem,index) => {
          if (dataItem.exch_group_no === exchGroupNo && baseCrncyType === dataItem.base_crncy_type) {
            let position = dataItem
            // 当前数量-冻结数量-成交占用数量+成交释放数量-交易占用
            result = position.curr_qty - position.frozen_qty
              - position.trade_capt_qty - position.strike_capt_qty + position.strike_releas_qty
          }
        })
        return result
      },
      targetAvaliableQty() {
        let exchGroupNo = this.dialogFormData.target_exch_group_no
        let result = 0
        this.tableData.forEach((dataItem,index) => {
          if (dataItem.exch_group_no === exchGroupNo && baseCrncyType === dataItem.baseCrncyType) {
            let position = dataItem
            // 当前数量-冻结数量-成交占用数量+成交释放数量-交易占用
            result = position.curr_qty - position.frozen_qty -
              position.trade_capt_qty - position.strike_capt_qty + position.strike_releas_qty
          }
        })
        return result
      }
    },
    mounted () {
      this.searchExchGroupPosition()
    },
    methods: {
      searchExchGroupPosition() {
        this.$post('prodL.2.21.json', {
          pd_no: this.formData.pd_no,
          exch_group_no: this.formData.exch_group_no,
          exch_no_str: this.formData.exch_no_str,
          stock_code_no: 0,
          base_crncy_type: this.formData.base_crncy_type,
          row_count: -1
        }).then(resp => {
          this.tableData = resp
        })
      },
      redChongHandler(event) {
        this.dialogTitle = '红冲'
        this.dialogType = 'redChong'
        this.dialogFormData = {
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          exch_no: this.selectedRow.exch_no
        }
        this.dialogTableVisible = false
        this.dialogFormVisible = true
      },
      blueFillHandler(event) {
        this.dialogTitle = '蓝补'
        this.dialogType = 'blueFill'
        this.dialogFormData = {
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          exch_no: this.selectedRow.exch_no
        }
        this.dialogTableVisible = false
        this.dialogFormVisible = true
      },
      transHandler(event) {
        this.dialogTitle = '持仓划转'
        this.dialogType = 'trans'
        this.dialogTableVisible = false
        this.dialogFormVisible = true
        this.dialogFormData = {
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          exch_no: this.selectedRow.exch_no
        }
      },
      doHandler () {
        if (this.dialogType === 'redChong' || this.dialogType === 'blueFill') {
          this.$post('prodL.2.1.json', {
            ...this.dialogFormData,
            is_change_asac_posi: 1,
            occur_qty: this.dialogType === 'redChong' ? (0 - this.dialogFormData.occur_qty): this.dialogFormData.occur_qty
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('操作成功')
            this.searchExchGroupPosition()
          })
        } else if(this.dialogType === 'trans'){
          this.$post('prodL.2.6.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('操作成功')
            this.searchExchGroupPosition()
          })
        } else if (this.dialogType === 'frozen') {
          this.$post('prodL.2.2.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('冻结成功')
            this.searchExchGroupPosition()
          })
        } else if (this.dialogType === 'unfrozen') {
          this.$post('prodL.2.4.json', {
            ...this.dialogFormData
          }).then(resp => {
            this.dialogFormVisible = false
            this.$message.success('解冻成功')
            this.searchExchGroupPosition()
          })
        }
      },

      frozenHandler () {
        this.dialogTitle = '冻结持仓'
        this.dialogType = 'frozen'
        this.dialogFormData = {
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          exch_no: this.selectedRow.exch_no
        }
        this.dialogTableVisible = false
        this.dialogFormVisible = true
      },

      refreshHandler () {
        let row = this.selectedRow || this.selectedDialogRow
        if (this.dialogTableType === 'frozen') {
          this.$post('prodL.2.34.json', {
            pd_no: row.pd_no,
            exch_group_no: row.exch_group_no,
            exch_no_str: row.exch_no,
            base_crncy_type: row.base_crncy_type,
            frozen_type: 1,
            row_count: -1
          }).then(resp => {
            this.dialogTableData = resp
          })
        } else if (this.dialogTableType === 'frozen') {
          this.$post('prodL.2.34.json', {
            pd_no: row.pd_no,
            exch_group_no: row.exch_group_no,
            exch_no_str: row.exch_no,
            base_crncy_type: row.base_crncy_type,
            frozen_type: 2,
            row_count: -1
          }).then(resp => {
            this.dialogTableData = resp
          })
        }
      },
      cancelFrozen () {
        this.dialogTitle = '取消冻结持仓'
        this.dialogTableType = 'frozen'
        this.dialogTableVisible = true
        this.$post('prodL.2.34.json', {
          pd_no: this.selectedRow.pd_no,
          exch_group_no: this.selectedRow.exch_group_no,
          exch_no_str: this.selectedRow.exch_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          frozen_type: 1,
          row_count: -1
        }).then(resp => {
          this.$nextTick(() => {
            this.dialogTableData = resp
            this.dialogFormVisible = true
          })
        })
      },
      doCancelFrozen () {
        let allSelections = this.$refs.dialogTable.getAllSelections()
        let promises = []
        allSelections.forEach(selection => {
          promises.push(this.$post('prodL.2.3.json', {
              row_id: selection.row_id
          }))
        })
        this.$http.all(promises).then(resps => {
          this.$message.success('取消冻结成功')
          this.refreshHandler()
          this.searchExchGroupPosition()
        })
      },
      unfrozenHandler() {
        this.dialogTitle = '解冻持仓'
        this.dialogType = 'unfrozen'
        this.dialogFormData = {
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          exch_no: this.selectedRow.exch_no
        }
        this.dialogTableVisible = false
        this.dialogFormVisible = true
      },
      cancelUnfrozen() {
        this.dialogTableType = 'unfrozen'
        this.dialogTableVisible = true
        this.$post('prodL.2.34.json', {
          pd_no: this.selectedRow.pd_no,
          exch_group_no: this.selectedRow.exch_group_no,
          exch_no_str: this.selectedRow.exch_no,
          base_crncy_type: this.selectedRow.base_crncy_type,
          frozen_type: 2,
          row_count: -1
        }).then(resp => {
          this.$nextTick(() => {
            this.dialogTableData = resp
            this.dialogFormVisible = true
          })
        })
      },
      doCancelUnFrozen () {
        let allSelections = this.$refs.dialogTable.getAllSelections()
        let promises = []
        allSelections.forEach(selection => {
          promises.push(this.$post('prodL.2.5.json', {
            row_id: selection.row_id
          }))
        })
        this.$http.all(promises).then(resps => {
          this.$message.success('取消解冻成功')
          this.refreshHandler()
          this.searchExchGroupPosition()
        })
      },
      assetAccoChangeHandler(newValue) {
        this.$refs.exchGroupSelector.clear()
      },

      pdChangeHandler(newValue) {
        this.$refs.exchGroupSelector.clear()
        this.$refs.assetAccoSelector.clear()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-date-editor {
    width: 100%;
  }
</style>

