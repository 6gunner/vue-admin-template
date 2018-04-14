<template>
  <div>
    <el-button @click="show = !show">Click Me</el-button>
    <transition
      name="horizontal-collapse"
      leave-active-class="horizontal-collapse-transition"
    >
      <div v-show="show" style="border: 1px solid #ccc; width: 500px; height: 600px">
        <el-tree class="my-tree"
                 ref="tree"
                 empty-text="菜单权限"
                 :show-checkbox="true"
                 node-key="id"
                 :highlight-current="true"
                 :data="data"
                 :props="defaultProps"
                 @check-change="checkChangeHandler"
                 @current-change="currentChangeHandler"
        ></el-tree>
      </div>
    </transition>
  </div>
</template>
<script>
import {Button, Tree} from 'element-ui'

export default {
  components: {
    'el-button': Button,
    'el-tree': Tree
  },
  data () {
    return {
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 11,
          label: '二级 1-1'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      show: true
    }
  },
  methods: {
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    checkChangeHandler (selectedNode, isChecked, extraChecked) {
      console.log(arguments)
    },
    currentChangeHandler (currentData, currentNode) {
      console.log(arguments)
    }
  }
}
</script>
<style lang="scss">
  .horizontal-collapse-enter-active {
    -webkit-transition: .3s width ease-in-out, .3s padding-left ease-in-out, .3s padding-right ease-in-out;
    transition: .3s width ease-in-out, .3s padding-left ease-in-out, .3s padding-right ease-in-out
  }

  .horizontal-collapse-leave-active {
    -webkit-transition: .3s width ease-in-out, .3s padding-left ease-in-out, .3s padding-right ease-in-out;
    transition: .3s width ease-in-out, .3s padding-left ease-in-out, .3s padding-right ease-in-out
  }

</style>
