import Vue from 'vue'
import Vuex from 'vuex'

import login from './modules/login'
import dict from './modules/dictionary'
import menu from './modules/menu'


Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    dict,
    login,
    menu
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
