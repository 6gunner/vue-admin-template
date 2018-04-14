<template>
  <el-container class="login">
    <el-header class="login-header" height="58px">
      <div class="login-logo">
        <img src="~@/assets/logo.svg" alt="" >
      </div>
    </el-header>
    <el-main class="login-main">
      <el-form action="" class="login-form">
        <label class="login-title">管理端登录</label>
        <el-input name="username" v-model="username" placeholder="输入用户名" clearable></el-input>
        <div class="el-input">
          <input type="password" class="el-input__inner" v-model="password" placeholder="输入密码" @keyup.enter="loginHandler">
        </div>
        <el-button type="primary" @click="loginHandler" >登录</el-button>
      </el-form>
    </el-main>
    <el-footer class="login-footer" height="10px"></el-footer>
  </el-container>
</template>
<script>
import { base64, md5 } from '@/tools/index'
import { Alert, Button, Container, Form, Footer, Header, Input, Main } from 'element-ui'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      username: '',
      password: '',
      error: false,
      errorMsg: ''
    }
  },
  components: {
    'el-button': Button,
    'el-container': Container,
    'el-header': Header,
    'el-form': Form,
    'el-footer': Footer,
    'el-input': Input,
    'el-main': Main
  },
  methods: {
    ...mapActions('login', ['login']),
    loginHandler () {
      let username = this.username
      let password = this.password
      let data = {
        operator_no: username,
        operator_password: base64.encode(md5(username + '#' + password))
      }
      this.login(data).then(() => {
        this.$router.push('/index')
      }).catch(error => {
        console.error('登录失败: ' + error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .login {
    height: 100%;
    width: 100%;
  }
  .login-header {
    background-color: #000;
  }
  .login-main {
    /*background: #FFF;*/
    background: url('~@/assets/login-bg.jpg') 0 0 no-repeat;
    background-size: 100% 100%;
  }
  .login-footer {
    background-color: #000;
  }
  .login-form {
    background-color: rgba(35,35,35,.75);
    border-color: transparent;
    width: 300px;
    height: 290px;
    font-size: 14px;
    position: absolute;
    top: 25%;
    right: 20%;
    color: #fff;
  }
  .login-logo {
    width: 150px;
    height: 58px;
    line-height: 58px;
    display: inline-block;
    padding-left: 10px;
    img {
      vertical-align: middle;
    }
  }
  .login-title {
    color: #5698FF;
    display: inline-block;
    height: 50px;
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #5698FF;
  }
  /deep/ .el-input {
    width: 80%;
    margin: 10px 10%;
    &:nth-child(2) {
      margin-top: 30px;
    }
    &:nth-child(3) {
      margin-bottom: 20px;
    }
    .el-input__inner {
      background-color: transparent;
      border:none;
      border-bottom: 1px solid #FFF;
      border-radius: 0;
      color: #FFF;
      font-size: 18px;
      padding-left: 0px;
    }
    .el-input__icon {
      font-size: 18px;
      color: #FFF;
    }
  }
  .el-button {
    width: 80%;
    margin: 10px 10%;
  }
</style>
