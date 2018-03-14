// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import _ from 'underscore'
import NProgress from 'nprogress' // progress bar
import { sync } from 'vuex-router-sync'
import Vue from 'vue'
import AjaxPlugin from './plugins/ajax'
import MessagePlugin from './plugins/message'
import App from './App'
import router from './router'
import store from './store'

import './assets/reset.css'
import 'nprogress/nprogress.css'// progress bar style
import './assets/iconfont/iconfont.css'


NProgress.configure({ showSpinner: false })

Vue.config.productionTip = false

/*  会同步以下几个属性
 * {
    path: '',
    query: null,
    params: null
  }
 */
sync(store, router)

Vue.use(AjaxPlugin)
Vue.use(MessagePlugin)

Vue.filter('uppercase', value => {
  return value && value.toUpperCase()
})

Vue.http.interceptors.request.use(config => {

  return config
}, error => {
  return Promise.reject(error)
})
Vue.http.interceptors.response.use(response => {
  if (response.data.error_code && response.data.error_code === '9999') {
    store.commit('login/logout')
    router.replace({
      path: '/',
      query: {redirect: router.currentRoute.fullPath}
    })
    return Promise.reject(response.data)
  } else if (response.data.error_code && response.data.error_code !== '0') {
    Vue.prototype.$notify.error({
      title: '错误',
      message: response.data.error_info,
      duration: 0
    })
    return Promise.reject(response.data.error_info)
  } else {
    return response.data
  }
}, error => {
  return Promise.reject(error)
})


router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/login') {
    next()
  }else {
    if (!_.isEmpty(store.state.login.user)) {
      if (to.matched.length) {
        next()
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
        next()
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
