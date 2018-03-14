import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/Index'
import {lazyLoad} from '@/tools/index'

Vue.use(VueRouter)

// 以 / 开头的嵌套路径会被当作根路径 这让你充分的使用嵌套组件而无须设置嵌套的路径
export default new VueRouter({
  routes: [
    {
      path: '',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'Login',
      component: lazyLoad('Login')
    }, {
      path: '/404',
      name: '404',
      component: lazyLoad('404')
    }, {
      path: '/index',
      component: Index,
      meta: {
        requireAuth: true
      },
      children: [{
        name: 'Index',
        path: '',
        component: lazyLoad('Welcome'),
        meta: {
          title: '首页',
          requireAuth: true
        }
      }]
    }
  ]
})

