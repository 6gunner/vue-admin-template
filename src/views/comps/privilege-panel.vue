<template>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="账户权限" name="1">
      <el-tree ref="tree"
               :show-checkbox="true"
               node-key="id"
               :highlight-current="true"
               :data="privilegeDatas"
               :props="{label: 'name', children:'children'}"
               :default-checked-keys="defaultChecked"
      ></el-tree>
      <div class="panel-footer">
        <el-button type="primary" @click="confirmAdd" size="medium">确定</el-button>
        <el-button type="info" @click="cancel" size="medium">取消</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import _ from 'underscore'
import { Button, ButtonGroup, Tabs, TabPane, Tree } from 'element-ui'
export default {
  components: {
    'el-button': Button,
    'el-button-group': ButtonGroup,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-tree': Tree
  },
  data () {
    return {
      activeName: '1',
      defaultChecked: [],
      companys: [],
      products: [],
      exchGroups: []
    }
  },
  props: {
    oporNo: Number
  },
  computed: {
    privilegeDatas () {
      let results = []
      if (this.companys.length && this.products.length && this.exchGroups.length) {
        let temp = this.companys[0]
        this.products.forEach(pd => {
          this.exchGroups.forEach(exch => {
            if (exch.pd_no === pd.pd_no) {
              pd.children.push(exch)
            }
          })
          temp.children.push(pd)
        })
        results.push(temp)
      }
      return results
    }
  },
  mounted () {
    this.queryAllCompanys()
    this.queryAllProducts()
    this.queryAllExchGroups()
    this.queryAccountPrivilege()
  },
  methods: {
    queryAllCompanys () {
      this.$post('pubL.17.19.json').then(resp => {
        let companys = resp.map(item => {
          return {
            id: '2-' + item.co_no,
            name: item.co_name,
            children: []
          }
        })
        if (_.difference(this.companys, companys)) {
          this.companys = companys
        }
      })
    },
    queryAllProducts () {
      this.$post('prodL.1.12.json').then(resp => {
        let products = resp.map(item => {
          return {
            id: '3-' + item.pd_no,
            name: item.pd_name,
            pd_no: item.pd_no,
            children: []
          }
        })
        if (_.difference(this.products, products)) {
          this.products = products
        }
      })
    },
    queryAllExchGroups () {
      this.$post('prodL.1.89.json').then(resp => {
        let exchGroups = resp.map(item => {
          return {
            id: '4-' + item.pd_no + '-' + item.asset_acco_no + '-' + item.exch_group_no ,
            pd_no: item.pd_no,
            exch_group_no: item.exch_group_no,
            asset_acco_no: item.asset_acco_no,
            name: item.exch_group_name
          }
        })
        if (_.difference(this.exchGroups, exchGroups)) {
          this.exchGroups = exchGroups
        }
      })
    },
    queryAccountPrivilege () {
      this.$post('pubL.19.71.json', {
        query_opor_no: this.oporNo
      }).then(resp => {
        this.myPrivilege = resp
        this.defaultChecked = resp.map(item => {
          if (item.right_level === 2) {
            return '2-' + item.co_no
          } else if (item.right_level === 3) {
            return '3-' + item.pd_no
          } else if (item.right_level === 4) {
            return '4-' + item.pd_no + '-' + item.asset_acco_no + '-' + item.exch_group_no
          }
        })
        this.$refs.tree.setCheckedKeys(this.defaultChecked)
      })
    },
    cancel () {
      this.$emit('cancel')
    },
    confirmAdd () {
      let oldValue = this.defaultChecked
      let newValue = this.$refs.tree.getCheckedKeys()
      let promises = []
      // 删除操作
      let diff1 = _.difference(oldValue, newValue)
      if (diff1.length) {
        let groups = _.groupBy(diff1, item => {
          return item.split('-')[0]
        })
        _.each(groups, (group, groupName) => {
          if (groupName === '2') {
            promises.push(this.$post('pubL.19.42.json', {
              target_opor_no: this.oporNo
            }))
          } else if (groupName === '3') {
            promises.push(this.$post('pubL.19.46.json', {
              target_opor_no: this.oporNo,
              pd_no_str: group.map(item => item.split('-')[1]).join(';') + ';'
            }))
          } else if (groupName === '4') {
            promises.push(this.$post('pubL.19.62.json', {
              target_opor_no: this.oporNo,
              exch_group_no_str: group.map(item => item.split('-')[3]).join(';') + ';'
            }))
          }
        })
      }
      // 新增操作
      let diff2 = _.difference(newValue, oldValue)
      if (diff2) {
        let groups = _.groupBy(diff2, item => {
          return item.split('-')[0]
        })
        _.each(groups, (group, groupName) => {
          if (groupName === '2') {
            promises.push(this.$post('pubL.19.41.json', {
              target_opor_no: this.oporNo
            }))
          } else if (groupName === '3') {
            promises.push(this.$post('pubL.19.45.json', {
              target_opor_no: this.oporNo,
              pd_no_str: group.map(item => item.split('-')[1]).join(';') + ';'
            }))
          } else if (groupName === '4') {
            promises.push(this.$post('pubL.19.61.json', {
              target_opor_no: this.oporNo,
              pd_no_str: group.map(item => item.split('-')[1]).join(';') + ';',
              asset_acco_no_str: group.map(item => item.split('-')[2]).join(';') + ';',
              exch_group_no_str: group.map(item => item.split('-')[3]).join(';') + ';'
            }))
          }
        })
      }
      this.$http.all(promises).then(resps => {
        this.$message.success('配置成功')
      }, error => {
        this.$message.error('系统异常，请重新配置')
      })
    }
  },
  watch: {
    oporNo (newValue, oldValue) {
      this.queryAccountPrivilege()
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-tab-pane {
    height: 380px;
    width: 100%;
    position: relative;
    padding-bottom: 50px;
  }
  .el-tree {
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0px;
      height: 10px;
      background-color: transparent;
    }
    /*滚动条里面的小方块*/
    &::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
      background-color: rgba(145, 148, 164, 0.15);
      border-radius: 10px;
    }
    /*滚动条里面的轨道*/
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
      background-color: #FFFFFF;
    }
  }
  .el-button-group{
    position: absolute;
    bottom: 100px;
  }
  .panel-footer{
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    width: 80%;
    text-align: center;
    margin: 0 auto;
  }
</style>
