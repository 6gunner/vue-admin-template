<template>
  <el-header height="56px">
    <a href="#" class="header-logo">
      <img src="~@/assets/logo.svg" class="header-logo-img">
    </a>
    <ul class="header-user">
      <li class="el-menu-item">
        <a @click="toggleUserList">
          你好，{{user.operator_name}}
          <i class="el-menu-icon el-icon-caret-bottom"></i>
        </a>
        <ul class="header-user-list" v-show="show">
          <li @click="dialogVisible = true"><a href="javascript:;"><i class="el-icon-edit-outline"></i>修改密码</a></li>
          <li @click="logout"><a href="javascript:;"><i class="iconfont icon-logout"></i>注销</a></li>
        </ul>
      </li>
    </ul>
  </el-header>
</template>
<script>
  import {Header} from 'element-ui'
  import {mapActions} from 'vuex'
  export default {
    data () {
      return {
        user: {
          operator_name: 'Ky'
        },
        show: false
      }
    },
    components: {
      'el-header': Header
    },
    methods: {
      ...mapActions('login', ['logout']),
      toggleUserList ()　{
        this.show = !this.show
      }
    }
  }
</script>
<style lang="scss" scoped>
  $nav-height: 56px;
  $color: #909399;
  .el-header {
    position: relative;
    display: flex;
    background-color: #181B2A;
  }
  .header-logo {
    height: $nav-height;
    line-height: $nav-height;
    width: 150px;
    display: inline-block;
    padding-left: 10px;
  }
  .header-logo-img {
    display: inline-block;
    vertical-align: middle;
  }
  .header-user {
    position: absolute;
    right: 0px;
    width: 200px;
    .el-menu-item {
      color: $color;
      background-color: transparent;
    }
  }
  .header-user-list {
    position: absolute;
    background: #262A42;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    border-radius: 3px;
    width: 150px;
    z-index: 8;
    list-style: none;
    li {
      width: 100%;
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      a {
        color: $color;
        text-decoration: none;
      }
      i {
        font-size: 18px;
        width: 24px;
        margin-right: 10px;
      }
      &:hover {
        background-color: #1E2235;
      }
    }
  }

</style>
