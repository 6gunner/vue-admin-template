<template>
  <el-menu default-active="1"
           :unique-opened="true"
           :router="true"
           class="side-menu"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           @open="handleOpen"
           @close="handleClose"
           :collapse="collapse"
           :default-active="defaultActive"
           :default-openeds="defaultOpeneds"
           >
    <template v-for="menu in menus">
      <el-submenu v-if="menu.children" :index="menu.url">
        <template slot="title">
          <i v-if="menu.icon" :class="menu.icon"></i>
          <span slot="title">{{menu.name}}</span>
        </template>
        <template v-for="submenu in menu.children">
          <el-submenu :index="submenu.url" v-if="submenu.children">
            <template slot="title">
              <i v-if="submenu.icon" :class="submenu.icon"></i>
              <span slot="title">{{submenu.name}}</span>
            </template>
            <el-menu-item v-for="subsubmenu in submenu.children" :index="subsubmenu.url" :key="subsubmenu.id">
              {{subsubmenu.name}}
            </el-menu-item>
          </el-submenu>
          <el-menu-item :index="submenu.url" :key="submenu.id" v-else>
            {{submenu.name}}
          </el-menu-item>
        </template>
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
      defaultActive: '',
      defaultOpeneds: []
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
  },
  watch: {
    menus(newValue) {
      this.$nextTick(() => {
        this.defaultActive = this.$route.path
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .side-menu{
    &:not(.el-menu--collapse) {
      width: 180px;
      border: none;
    }
    /deep/ .el-submenu {
      .el-menu-item {
        min-width: 180px;
      }
      .iconfont {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 24px;
        text-align: center;
        font-size: 18px;
      }
    }
  }
</style>



