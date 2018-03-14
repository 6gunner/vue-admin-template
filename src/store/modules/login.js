/**
 * Created by KY on 2017/10/18.
 */
import { ajax } from '@/tools/index'
import _ from 'underscore'
export default {
  namespaced: true,
  state: {
    user: JSON.parse(sessionStorage.getItem('user')) || {}
  },
  mutations: {
    loginSuccess (state, data) {
      sessionStorage.user = JSON.stringify(data)
      state.user = data
    },
    loginError (state, error) {
      sessionStorage.removeItem('user')
      state.user = null
    },
    logout (state) {
      sessionStorage.removeItem('user')
      state.user = null
      window.location.hash = '/'
    }
  },
  actions: {
    login ({commit}, data) {
      return ajax.post('login.do', data)
        .then(resp => {
          if (!_.isEmpty(resp) && !resp.error_code) {
            let user = _.omit(resp, 'error_code', 'error_deal', 'error_info', 'error_level', 'error_prompt')
            commit('loginSuccess', user)
          } else {
            commit('loginError', resp)
            throw new Error('登录失败,' + resp.error_info)
          }
        })
    },
    logout ({commit}) {
      return ajax.post('logout.do')
        .then(resp => {
          commit('logout')
        })
    }
  }
}
