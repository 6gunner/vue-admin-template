<!--交易组下拉框-->
<template>
  <el-cascader
    @active-item-change="handleItemChange"
    filterable
    :show-all-levels="false"
    :options="options"
  ></el-cascader>
</template>
<script>
  import { Cascader } from 'element-ui'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters('cache', ['avaliableProducts', 'avaliableAssets', 'avaliableExchGroups']),
      options() {
        let options = this.avaliableProducts.map(product => {
          return {
            ...product,
            children: []
          }
        })

        let assets = this.avaliableAssets.map(asset => {
          return {
            ...asset,
            children: []
          }
        })

        assets.forEach(asset => {
          this.avaliableExchGroups.forEach(exchGroup => {
            if (asset.asset_acco_no === exchGroup.asset_acco_no && exchGroup.pd_no === asset.pd_no) {
              asset.children.push(exchGroup)
            }
          })
        })

        options.forEach(option => {
          assets.forEach(asset => {
            if(asset.pd_no === option.pd_no) {
              option.children.push(asset)
            }
          })
        })

        return options
      }
    },
    props: {
      type: Number
    },
    components: {
      'el-cascader': Cascader
    },
    methods: {
      handleItemChange(val) {
        console.log('active item:', val)
      }
    }
  }
</script>
<style lang="scss">

</style>
