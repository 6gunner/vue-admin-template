// 数据字典
import { ajax } from '@/tools/index'
export default {
  namespaced: true,
  state: {
    dict: JSON.parse(localStorage.getItem('dict')) || {}
  },
  mutations: {
    setData (state, data) {
      localStorage.setItem('dict', JSON.stringify(data))
      state.dict = data
    }
  },
  getters: {
    getDictByName: (state) => (dictName) => {
      return state.dict[dictName]
    },
    translateDict: (state) => (dictName, itemKey) => {
      let dictItems = state.dict[dictName]
      if (dictItems != null && dictItems.hasOwnProperty(itemKey)) {
        return dictItems[itemKey]
      }
      return ''
    }
  },
  actions: {
    fetchDict ({ commit }) {
      ajax.post('getDict.do')
        .then(resp => {
          commit('setData', resp)
        })
    }
  }
}
