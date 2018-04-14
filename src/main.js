// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import _ from 'underscore'
import NProgress from 'nprogress' // progress bar
// import { sync } from 'vuex-router-sync'
import Vue from 'vue'
import AjaxPlugin from './plugins/ajax'
import MessagePlugin from './plugins/message'
import WSPlugin from './plugins/ws/index'
import LoadingPlugin from 'element-ui/packages/loading'
import { Draggable } from 'draggable-vue-directive'
import App from './App'
import router from './router'
import store from './store'

import './assets/reset.css'
import 'nprogress/nprogress.css'// progress bar style
import './assets/iconfont/iconfont.css'
import { WS_HOST } from '@/config'

let loadingInstance = null

// 报盘主推数据
const WS_URL = `ws://${WS_HOST}/ws`

NProgress.configure({ showSpinner: false })

Vue.config.productionTip = false


/*  会同步以下几个属性
 * {
    path: '',
    query: null,
    params: null
  }
 */
// sync(store, router)
Vue.directive('draggable', Draggable)
Vue.use(AjaxPlugin)
Vue.use(MessagePlugin)
Vue.use(LoadingPlugin)
Vue.use(WSPlugin, WS_URL, {
  store: store,
  format: 'json',
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
})

Vue.filter('uppercase', value => {
  return value && value.toUpperCase()
})
Vue.prototype.$ELEMENT = { size: 'small' }
Vue.prototype.$http.interceptors.request.use(config => {
  loadingInstance && loadingInstance.close()
  loadingInstance = Vue.prototype.$loading({
    target: '.el-main',
    text: '努力加载中',
    fullscreen: false,
    body: true
  })
  return config
}, error => {
  loadingInstance.close()
  return Promise.reject(error)
})
Vue.prototype.$http.interceptors.response.use(response => {
  loadingInstance.close()
  if (response.data.error_code && response.data.error_code === '9999') {
    store.commit('login/logout')
    router.replace({
      path: '/',
      query: {redirect: router.currentRoute.fullPath}
    })
    return Promise.reject(response.data)
  } else if (response.data.error_code && response.data.error_code !== '0') {
    let errorData = response.data.data
    let errorInfo = response.data.error_info.split(',')
    if (errorData && errorData.errorPrompt) {
      let i = 0
      let errorMsg = errorData.errorPrompt.replace(/{#}/g, () => {
        i++
        return errorInfo[i - 1]
      })
      Vue.prototype.$notify.closeAll()
      Vue.prototype.$notify.error({
        title: '错误',
        message: errorMsg
      })
    }
    return Promise.reject(response.data)
  } else {
    return response.data
  }
}, error => {
  loadingInstance.close()
  Vue.prototype.$notify.closeAll()
  Vue.prototype.$notify.error({
    title: '错误',
    message: error.response.status + ':' + error.response.statusText,
    duration: 0
  })
  return Promise.reject(error)
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/login') {
    next()
  }else {
    if (!_.isEmpty(store.state.login.user)) {
      if (to.matched.length) {
        try {
          next()
        } catch(err){
          next({path: '/404'})
        }
      } else {
        store.dispatch('menu/getMenus').then(() => {
          next({...to, replace: true})
        }).catch(() => {
          next({path: '/'})
        })
      }
    } else {
      if (to.matched.some(record => record.meta.requireAuth)) {
        next({
          path: '/'
        })
      } else {
        next('/')
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
