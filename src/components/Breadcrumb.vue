<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script>
import _ from 'underscore'
import { Breadcrumb, BreadcrumbItem } from 'element-ui'
export default {
    created() {
      this.getBreadcrumb()
    },
    data() {
      return {
        levelList: null
      }
    },
    components: {
      'el-breadcrumb': Breadcrumb,
      'el-breadcrumb-item': BreadcrumbItem,
    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => !_.isEmpty(item.meta))
        const first = matched[0]
        if (first && first.path !== '/index') {
          matched = [{ path: '/index', meta: { title: '首页' }}].concat(matched)
        }
        this.levelList = matched
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    margin-left: 10px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    padding: 0;
    display: inline-block;
    font-size: 14px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
