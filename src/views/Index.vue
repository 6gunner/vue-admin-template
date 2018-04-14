<template>
  <el-container direction="vertical">
    <nav-header @changePwd="()=>{dialogVisible = true}">
    </nav-header>
    <el-main>
      <el-container class="main-container">
        <div class="side-container">
          <side-menu class="side-menu" :collapse="isMenuCollapse"></side-menu>
        </div>
        <div class="page-container" :class="{ml:isMenuCollapse}">
          <div class="page-bar">
            <hamburger :toggleClick="() => { isMenuCollapse = !isMenuCollapse }" :isActive="!isMenuCollapse"></hamburger>
            <breadcrumb></breadcrumb>
          </div>
          <router-view class="view-container"></router-view>
        </div>
      </el-container>
    </el-main>
    <el-dialog
      v-draggable
      title="修改密码"
      :visible.sync="dialogVisible"
      append-to-body
      :lock-scroll="false"
      :close-on-click-modal="false"
      width="450px"
      center>
      <el-form :model="form" staus-icon :rules="rules" width="30%" ref="form">
        <el-form-item label="原密码" label-width="100px" prop="oldPassword">
          <el-input type="password" v-model="form.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="100px" prop="newPassword">
          <el-input type="password" v-model="form.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="100px" prop="checkPassword">
          <el-input type="password" v-model="form.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
import { base64, md5, WS } from '@/tools/index'
import { Aside, Button, Container, Dialog, Form, FormItem, Footer, Header, Input, Main } from 'element-ui'
import { mapState, mapActions, mapMutations } from 'vuex'
import NavHeader from '@/components/NavHeader'
import SideMenu from '@/components/SideMenu'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isMenuCollapse: false,
      dialogVisible: false,
      form: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      draggableObj: {
        boundingRect: document.body.getBoundingClientRect()

      }
    }
  },
  components: {
    'el-aside': Aside,
    'el-button': Button,
    'el-container': Container,
    'el-dialog': Dialog,
    'el-header': Header,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-footer': Footer,
    'el-input': Input,
    'el-main': Main,
    SideMenu,
    NavHeader,
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapState('login', {
      user: state => state.user
    })
  },
  methods: {
    ...mapActions('login', ['logout']),
    ...mapActions('menu', ['getMenus']),
    ...mapActions('cache', ['initCache']),
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    changePassword () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let oldPwd = base64.encode(md5(this.user.operator_no + '#' + this.form.oldPassword))
          let newPwd = base64.encode(md5(this.user.operator_no + '#' + this.form.newPassword))
          this.$post('pubL.5.9.json', {
            opor_old_pwd: oldPwd,
            opor_new_pwd: newPwd
          }).then(reps => {
            this.$message.success('修改密码成功')
            this.dialogVisible = false
          })
        } else {
          return false
        }
      })
    }
  },
  beforeMount () {
    this.getMenus()
    this.initCache()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~@/assets/theme.scss';
  .el-container {
    height: 100%;
  }
  .el-main {
    padding: 0;
    height: calc(100% - 56px);
    position: relative;
    background-color: $theme-bg-color;
  }
  .el-footer {
    background-color: #181B2A;
    position: relative;
  }
  .main-container {
    width: 100%;
  }
  .side-container {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 100;

    .side-menu {
      height: 100%;
      overflow: scroll;
    }
  }
  .page-container {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: padding-left .28s;
    padding-left: 180px;
    background-color: #fff;
    overflow: scroll;
    &.ml{
      padding-left: 64px;
    }
    .page-bar {
      height: 40px;
      line-height: 40px;
      width: 100%;
      background-color: #fff;
      margin: 0;
      padding: 0;
      box-shadow: .5px .5px .5px #888;
    }
    .view-container {
      background-color: #fff;
      margin-top: 5px;
    }

    /*滚动条整体部分*/
    &::-webkit-scrollbar {
      width: 5px;
      height: 0;
      background-color: transparent;
    }
    /*滚动条里面的小方块*/
    &::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
      background-color: rgba(145, 148, 164, 0.15);
    }
    /*滚动条里面的轨道*/
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
      background-color: #FFFFFF;
    }
  }

  .collapseMenu {
    font-size: 30px;
    line-height: 56px;
    color: $color;
    margin-left: 10px;
  }
</style>
