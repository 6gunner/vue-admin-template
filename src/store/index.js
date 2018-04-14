import Vue from 'vue'
import Vuex from 'vuex'

import login from './modules/login'
import dict from './modules/dictionary'
import menu from './modules/menu'
import cache from './modules/cache'
import websocket from './modules/websocket'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    cache,
    dict,
    login,
    menu,
    websocket
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
