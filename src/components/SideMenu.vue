<template>
  <el-menu default-active="1"
           :router="true"
           class="side-menu"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           @open="handleOpen"
           @close="handleClose"
           :collapse="collapse">
    <template v-for="menu in menus">
      <el-submenu v-if="menu.children" index="menu.id">
        <template slot="title">
          <i v-if="menu.icon" :class="menu.icon"></i>
          <span slot="title">{{menu.name}}</span>
        </template>
        <el-menu-item v-for="submenu in menu.children" :index="submenu.url" :key="submenu.id">
          {{submenu.name}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :index="menu.url" :disabled="menu.disabled==='1'">
        <i v-if="menu.icon" :class="menu.icon"></i>
        <span slot="title">{{menu.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
import {Menu, MenuItem, MenuItemGroup, Submenu} from 'element-ui'
import {mapState} from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState('menu', {
      menus: state => state.menus
    })
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-menu-item-group': MenuItemGroup,
    'el-submenu': Submenu
  },
  methods: {
    handleOpen () {
    },
    handleClose () {
    }
  }
}
</script>
<style lang="scss" scoped>
  .side-menu:not(.el-menu--collapse) {
    width: 180px;
  }
  .el-menu {
    width: 180px;
    border: none;
  }
  /deep/ .el-submenu {
    .el-menu-item {
      min-width: 180px;
    }
  }
</style>



