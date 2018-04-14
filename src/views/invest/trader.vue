<!--投资、交易员管理-->
<template>
  <div>
    <el-row :style="{height: computedStyle.height + 'px'}">
      <el-col :span="8" style="height: 100%">
        <el-card>
          <div slot="header" class="clearfix">
            <span>业务账户名称</span>
          </div>
          <div class="custom-tree-node">
            <el-row v-for="data in assetAccoDatas" :key="data.pd_no+'-'+data.asset_acco_co"
                    v-on:click.native="setAssetAccoData($event, data)"
                    :class="{'is-current': currentAssetAccoData === data}">
              <el-col :span="24">
                <label>机构账户名称: </label><span>{{data.pd_name}}</span>
                <el-tag>{{translateDict('pd_status', data.pd_status) }}</el-tag>
              </el-col>
              <el-col :span="24">
                <label>业务账户名称: </label><span>{{data.asset_acco_name}}</span>
                <el-tag>{{ translateDict('asset_acco_status', data.asset_acco_status) }}</el-tag>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" style="height: 100%">
        <easy-table ref="table" :columns="tableColumns" :data="tableDatas" :table-height="computedStyle.height/2 + 'px'"
                    :style="{'height': selectedRow ? '60%' : '100%'}"
                    @current-change="(currentRow) => {selectedRow = currentRow}">
          <slot>
            <el-button-group>
              <el-button type="info" size="small" @click="addHandler" >新增</el-button>
              <el-button type="warning" size="small" :disabled="selectedRow === null" @click="editHandler" >修改
              </el-button>
            </el-button-group>
            <el-button-group>
              <el-button type="info" size="small" :disabled="selectedRow === null || selectedRow.opor_no === this.user.operator_no || selectedRow.opor_status !== '1'" @click="frozenHandler">冻结</el-button>
              <el-button type="warning" size="small" :disabled="selectedRow === null || selectedRow.opor_no === this.user.operator_no || selectedRow.opor_status !== '2'" @click="unfrozenHandler">解冻
              </el-button>
            </el-button-group>
            <el-button-group>
              <el-button type="danger" size="small" :disabled="selectedRow === null" @click="logoutHandler">注销
              </el-button>
            </el-button-group>
            <el-button-group>
              <el-button type="danger" size="small" :disabled="selectedRow === null || selectedRow.opor_no === this.user.operator_no || selectedRow.opor_status !== '1'"
                         @click="resetPwdHandler">重置密码
              </el-button>
            </el-button-group>
            <el-button-group class="btn-right">
              <el-button size="small" type="primary" icon="el-icon-refresh" @click="queryInvestManageAccoInfo">刷新
              </el-button>
            </el-button-group>
          </slot>
        </easy-table>
        <easy-table v-show="selectedRow !== null" ref="tradePositionTable" :columns="tradePositionTableColumns"
                    table-height="300px" style="height: 40%"
                    :data="tradePositionTableDatas" @current-change="(currentRow) => {selectedPositionRow = currentRow}">
          <slot>
            <el-button-group>
              <el-button size="small" @click="transHandler">持仓划转</el-button>
            </el-button-group>
          </slot>
        </easy-table>
      </el-col>
    </el-row>
    <el-dialog top="5vh" :title="dialogTitle"
               :visible.sync="dialogVisible" :append-to-body="true" :modal-append-to-body="true" :lock-scroll="false"
               :close-on-click-modal="false">
      <el-form :data="dialogFormData">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="机构编号" :label-width="formLabelWidth" :hidden="dialogType==='reset'">
              <el-input :value="user.company_no" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="操作员编号" :label-width="formLabelWidth">
              <el-input v-model="dialogFormData.target_opor_no" auto-complete="off" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="操作员名称" :label-width="formLabelWidth" >
              <el-input v-model="dialogFormData.opor_name" auto-complete="off" :disabled="dialogType==='reset'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="允许登录终端" :label-width="formLabelWidth" :hidden="dialogType==='reset'">
              <easy-select v-model="dialogFormData.allow_login_type" dict="oper_way" value-type="String"
                           :multiple="true" :show-all="false"></easy-select>
            </el-form-item>
          </el-col>
            <template v-show="dialogType==='add'">
            <el-col :span="11">
              <el-form-item label="操作员密码" :label-width="formLabelWidth" :hidden="dialogType==='edit'">
                <el-input v-model="dialogFormData.target_opor_pwd" type="password" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="重复密码" :label-width="formLabelWidth" :hidden="dialogType==='edit'">
                <el-input v-model="dialogFormData.target_opor_pwd" type="password"></el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="11">
            <el-form-item label="机构账户" :label-width="formLabelWidth" :hidden="dialogType==='reset'">
              <easy-select v-model="dialogFormData.pd_no" @change="()=>{$refs['assetAccountSelector'].clear()}"
                           :disabled="dialogType==='edit'" :data="avaliableProducts"
                           value-type="Number" :show-all="false"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="业务账户" :label-width="formLabelWidth":hidden="dialogType==='reset'">
              <easy-select v-model="dialogFormData.asset_acco_no" ref="assetAccountSelector"
                           :disabled="dialogType==='edit'" :data="avaliableAssets" value-type="Number" :show-all="false"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交易账户编码" :label-width="formLabelWidth":hidden="dialogType==='reset'">
              <el-input v-model="dialogFormData.exch_group_code" :disabled="dialogType==='edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交易账户名称" :label-width="formLabelWidth":hidden="dialogType==='reset'">
              <el-input v-model="dialogFormData.exch_group_name" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="允许提币" :label-width="formLabelWidth" :hidden="dialogType==='reset'">
              <easy-select v-model="dialogFormData.wtdraw_crncy_perm" dict="wtdraw_crncy_perm" value-type="Number" :showAll="false" ></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
          <el-form-item label="成本资产" :label-width="formLabelWidth" :hidden="dialogType==='reset'">
            <el-input v-model="dialogFormData.first_asset" value-type="String" size="small"></el-input>
          </el-form-item>
        </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="doHandler">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog top="5vh" title="持仓划转"
               :visible.sync="transDialogVisible" :append-to-body="true"
               :modal-append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
      <el-form :data="transDialogFormData">
        <el-row :gutter="20">

          <el-col :span="11">
            <el-form-item label="机构账户" :label-width="formLabelWidth">
              <easy-select v-model="transDialogFormData.pd_no" :data="avaliableProducts" value-type="Number"
                           :show-all="false" :disabled="true"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="业务账户" :label-width="formLabelWidth">
              <easy-select v-model="transDialogFormData.asset_acco_no" :data="avaliableAssets"
                           value-type="Number" :show-all="false" :disabled="true"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交易市场" :label-width="formLabelWidth">
              <easy-select v-model="transDialogFormData.exch_no" dict="exch_no" disabled></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="变动币种" :label-width="formLabelWidth">
              <easy-select v-model="transDialogFormData.base_crncy_type" value-type="String" dict="base_crncy_type"
                           :show-all="false" @change="()=>{$refs['avaliableQty'].clear()}"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="源交易组账户" :label-width="formLabelWidth">
              <easy-select v-model="transDialogFormData.source_exgp_no" :data="filterExchGroups(transDialogFormData.pd_no,transDialogFormData.asset_acco_no)" value-type="Number"
                           :show-all="false"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="源可用数量" :label-width="formLabelWidth">
              <el-input v-model="transDialogFormData.target_avai_qty" :disabled="true" ref="avaliableQty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="目标交易账户" :label-width="formLabelWidth">
              <easy-select v-model="transDialogFormData.target_exch_group_no" :data="filterExchGroups(transDialogFormData.pd_no,transDialogFormData.asset_acco_no)"
                           value-type="Number" :show-all="false"></easy-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="变动数量" :label-width="formLabelWidth">
              <el-input v-model="transDialogFormData.occur_qty" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doTransHandler">确 定</el-button>
      </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {ButtonGroup, Button, Card, Input, Dialog, Form, FormItem, Row, Col, Tag, Tree} from 'element-ui'
  import EasyTable from '@/components/EasyTable'
  import EasySelect from '@/components/EasySelect'
  import {mapState, mapGetters} from 'vuex'
  import {base64, md5} from '@/tools/index'

  export default {
    components: {
      'el-button': Button,
      'el-button-group': ButtonGroup,
      'el-input': Input,
      'el-row': Row,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-col': Col,
      'el-card': Card,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-tree': Tree,
      EasyTable,
      EasySelect
    },
    computed: {
      ...mapGetters('dict', ['translateDict']),
      ...mapState('login', {
        user: state => state.user
      }),
      ...mapGetters('cache', ['avaliableProducts', 'avaliableChannels', 'avaliableAssets', 'avaliableExchGroups', 'filterAssets', 'filterExchGroups']),

      sourceAvaliableQty() {
        let exchGroupNo = this.transDialogFormData.source_exgp_no
        let baseCrncyType = this.transDialogFormData.base_crncy_type
        let exchNo = this.transDialogFormData.exch_no
        let result = 0
        this.tradePositionTableDatas.forEach((dataItem, index) => {
          if (dataItem.exch_group_no === exchGroupNo && dataItem.exch_group_no=== exchNo && baseCrncyType === dataItem.base_crncy_type) {
            let position = dataItem
            // 当前数量-冻结数量-成交占用数量+成交释放数量-交易占用
            result = position.curr_qty - position.frozen_qty
              - position.trade_capt_qty - position.strike_capt_qty + position.strike_releas_qty
          }
        })
        return result
      }
    },
    data() {
      return {
        assetAccoDatas: [],
        computedStyle: {},
        currentAssetAccoData: {},
        defaultProps: [],
        dialogType: '',
        dialogTitle: '',
        dialogVisible: false,
        dialogFormData: {},
        transDialogVisible: false,
        transDialogFormData: {},
        filterText: '',
        formLabelWidth: '105px',
        selectedRow: null,
        selectedPositionRow: null,
        tableDatas: [],
        tableColumns: [{
          name: 'pd_name',
          title: '机构账户名称',
          width: 120
        }, {
          name: 'asset_acco_name',
          title: '业务账户名称',
        }, {
          name: 'exch_group_name',
          title: '交易账户名称',
        }, {
          name: 'exch_group_status',
          title: '交易账户状态',
          formatter(row, column, cellValue) {
            return this.translateDict('exch_group_status', cellValue)
          }
        }, {
          name: 'opor_no',
          title: '操作员编号'
        }, {
          name: 'opor_name',
          title: '操作员名称'
        }, {
          name: 'opor_status',
          title: '操作员状态',
          formatter(row, column, cellValue) {
            return this.translateDict('opor_status', cellValue)
          }
        }],
        tradePositionTableColumns: [{
          name: 'exch_no',
          title: '交易市场',
          formatter(row, column, cellValue) {
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
          formatter(row, column, cellValue) {
            // 当前数量+成交释放数量-成交占用
            return row.curr_qty - row.strike_capt_qty + row.strike_releas_qty
          }
        }, {
          title: '可用数量',
          formatter(row, column, cellValue) {
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
        }],
        tradePositionTableDatas: []
      }
    },
    mounted() {
      let height = document.querySelector('.el-main').clientHeight - 45
      this.computedStyle = {
        height: height
      }
      this.queryInvestAssetAcco()
    },
    methods: {
      getOporNo() {
        return this.$post('pubL.19.14.json', {
          co_no: this.user.company_no,
        })
      },
      // 查询投资业务账户
      queryInvestAssetAcco() {
        this.$post('prodL.1.201.json', {}).then(resp => {
          this.assetAccoDatas = resp
        })
      },
      setAssetAccoData(event, data) {
        this.currentAssetAccoData = data
        this.queryInvestManageAccoInfo()
      },

      searchTradePosition() {
        this.$post('prodL.2.21.json', {
          pd_no: this.selectedRow.pd_no,
          exch_group_no: this.selectedRow.exch_group_no,
          row_count: -1
        }).then(resp => {
          this.tradePositionTableDatas = resp
        })
      },
      // 查询投资管理账户信息
      queryInvestManageAccoInfo() {
        this.$post('prodL.1.202.json', {
          pd_no: this.currentAssetAccoData.pd_no || 0,
          asset_acco_no: this.currentAssetAccoData.asset_acco_no || 0,
          exch_group_no: this.currentAssetAccoData.exch_group_no || 0,
          query_opor_no: this.currentAssetAccoData.query_opor_no || 0
        }).then(resp => {
          this.tableDatas = resp
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      addHandler(event) {
        this.getOporNo().then(resp => {
          this.dialogFormData = {
            co_no: this.user.company_no,
            target_opor_no: resp.target_opor_no,
            pd_no: this.currentAssetAccoData.pd_no,
            asset_acco_no: this.currentAssetAccoData.asset_acco_no,
            allow_login_type: [],
            wtdraw_crncy_perm: 2,

          }
          this.dialogTitle = '新增投资管理账户'
          this.dialogType = 'add'
        })
        this.dialogVisible = true
      },

      doHandler() {
        if (this.dialogType === 'add') {
          this.$post('prodL.1.203.json', {
            ...this.dialogFormData,
            target_opor_pwd: base64.encode(md5(this.dialogFormData.target_opor_no + '#' + this.dialogFormData.target_opor_pwd)),
            allow_login_type: this.dialogFormData.allow_login_type.join(';')
          }).then(resp => {
            this.dialogVisible = false
            this.$message.success('新增投资管理账户成功')
            this.queryInvestManageAccoInfo()
          })
        } else if (this.dialogType === 'edit') {
          this.$post('prodL.1.204.json', {
            ...this.dialogFormData,
            allow_login_type: this.dialogFormData.allow_login_type.join(';')
          }).then(resp => {
            this.dialogVisible = false
            this.$message.success('修改投资管理账户成功')
            this.queryInvestManageAccoInfo()
          })
        } else if (this.dialogType === 'reset') {
          this.$post('pubL.19.10.json', {
            target_opor_no: this.dialogFormData.target_opor_no,
            opor_new_pwd: base64.encode(md5(this.dialogFormData.target_opor_no + '#' + this.dialogFormData.target_opor_pwd))
          }).then(resp => {
            this.dialogVisible = false
            this.$message.success('重置密码成功')
            this.queryInvestManageAccoInfo()
          })
        }
      },
      editHandler() {
        this.dialogVisible = true
        this.dialogTitle = '修改投资管理账户'
        this.dialogFormData = {
          co_no: this.selectedRow.co_no,
          target_opor_no: this.selectedRow.opor_no,
          opor_name: this.selectedRow.opor_name,
          pd_no: this.selectedRow.pd_no,
          asset_acco_no: this.selectedRow.asset_acco_no,
          exch_group_no: this.selectedRow.exch_group_no,
          exch_group_code: this.selectedRow.exch_group_code,
          exch_group_name: this.selectedRow.exch_group_name,
          wtdraw_crncy_perm: this.selectedRow.wtdraw_crncy_perm,
          first_asset: this.selectedRow.first_asset,
          allow_login_type: this.selectedRow.allow_login_type.split(';')
        }
        this.dialogType = 'edit'
      },
      resetPwdHandler(){
        this.dialogVisible = true
        this.dialogType = 'reset'
        this.dialogFormData = {
          target_opor_no: this.selectedRow.opor_no,
          opor_name: this.selectedRow.opor_name

        }
      },

      frozenHandler() {
        this.$confirm('您确定冻结此投资管理账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.205.json', {
            target_opor_no: this.selectedRow.opor_no,
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no,
            exch_group_no: this.selectedRow.exch_group_no
          }).then(resp => {
            this.$message.success('冻结成功')
            this.queryInvestManageAccoInfo()
          })
        })
      },
      unfrozenHandler() {
        this.$confirm('您确定解冻此投资管理账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.206.json', {
            target_opor_no: this.selectedRow.opor_no,
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no,
            exch_group_no: this.selectedRow.exch_group_no
          }).then(resp => {
            this.$message.success('解冻成功')
            this.queryInvestManageAccoInfo()
          })
        })
      },
      logoutHandler() {
        this.$confirm('您确定注销此投资管理账户吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('prodL.1.207.json', {
            target_opor_no: this.selectedRow.opor_no,
            pd_no: this.selectedRow.pd_no,
            asset_acco_no: this.selectedRow.asset_acco_no,
            exch_group_no: this.selectedRow.exch_group_no
          }).then(resp => {
            this.$message.success('注销成功')
            this.queryInvestManageAccoInfo()
          })
        })
      },
      transHandler(event) {
        this.transDialogVisible = true
        let data = this.selectedPositionRow
        this.transDialogFormData = {
          exch_no: this.selectedPositionRow.exch_no,
          base_crncy_type: this.selectedPositionRow.base_crncy_type,
          source_exgp_no: this.selectedPositionRow.exch_group_no,
          pd_no: this.selectedPositionRow.pd_no,
          asset_acco_no: this.selectedPositionRow.asset_acco_no,
          target_avai_qty: data.curr_qty-data.frozen_qty-data.trade_capt_qty- data.strike_capt_qty + data.strike_releas_qty
        }
      },
      doTransHandler(event) {
        this.$post('prodL.2.6.json', {
          ...this.transDialogFormData
        }).then(resp => {
          this.transDialogVisible = false
          this.$message.success('操作成功')
          this.queryInvestManageAccoInfo()
        })
      }
    },
    watch: {
      selectedRow(val) {
        if (val) {
          this.searchTradePosition()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-card {
    height: 100%;
  }

  .custom-tree-node {
    font-size: 12px;
    .el-row {
      border-radius: 5px;
      padding: 10px 5px;
      width: 100%;
      height: 100%;
      &.is-current {
        background-color: #f5f7fa;
      }
      &::hover {
        background-color: #f5f7fa;
      }
    }
  }
</style>
