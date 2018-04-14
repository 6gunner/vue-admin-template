// 缓存一些常用过滤数据
import { ajax } from '@/tools'
export default {
  namespaced: true,
  state: {
    operators: [],
    companys: [],
    products: [],
    channels: [],
    assets: [],
    exchGroups: [],
    systemDimensions: [],
    userDimensions: [],
    symbols: [],
    riskItems: [],
    riskTemplates: []
  },
  getters: {
    avaliableChannels(state) {
      return state.channels.filter(item => {
        return item.status === '1'
      })
    },
    avaliableProducts(state) {
      return state.products.filter(item => {
        return item.status === '1'
      })
    },
    avaliableOperators(state) {
      return state.operators.filter(item => {
        return item.status === '1'
      })
    },
    avaliableCompanys(state) {
      return state.companys.filter(item => {
        return item.status === '1'
      })
    },
    avaliableAssets(state) {
      return state.assets.filter(item => {
        return item.status === '1'
      })
    },
    avaliableExchGroups(state) {
      return state.exchGroups.filter(item => {
        return item.status === '1'
      })
    },
    filterCoAccounts: state => (co_no) => {
      return state.products.filter(item => {
        return item.co_no == co_no &&　item.status === '1'
      })
    },
    filterAssets: state => (pd_no) => {
      return state.assets.filter(item => {
        return item.pd_no == pd_no &&　item.status === '1'
      })
    },
    filterExchGroups: state => (pd_no, asset_acco_no) => {
      return state.exchGroups.filter(item => {
        return item.pd_no == pd_no && item.asset_acco_no == asset_acco_no　&& item.status === '1'
      })
    },
    filterSymbol: state => (symbol_code) => {
      return state.symbols.filter(item => {
        return symbol_code === item.value
      })
    },
    filterRiskItems: state => (risk_rule_type) => {
      return state.riskItems.filter(item => {
        return item.risk_rule_type === risk_rule_type
      })
    }
  },
  mutations: {
    setCompanys (state, data) {
      state.companys = data
    },
    setOperators (state, data) {
      state.operators = data
    },
    setProducts (state, data) {
      state.products = data
    },
    setChannels(state, data) {
      state.channels = data
    },
    setAssets(state, data) {
      state.assets = data
    },
    setExchGroups(state, data) {
      state.exchGroups = data
    },
    setSymbols(state, data) {
      state.symbols = data
    },
    setUserDimensions(state, data){
      state.userDimensions = data
    },
    setSystemDimensions(state, data){
      state.systemDimensions = data
    },
    setRiskTemplates(state, data) {
      state.riskTemplates = data
    },
    setRiskItems(state, data) {
      state.riskItems = data
    }
  },
  actions: {
    initCache ({commit}) {
      // 查操作员
      ajax.post('pubL.19.4.json', {
        query_opor_no: 0,
        opor_status_str: ' ',
        row_count: -1
      }).then(resp => {
        let results = resp.map(item => {
          return {
            label: item.opor_name,
            value: item.opor_no,
            status: item.opor_status
          }
        })
        commit('setOperators', results)
      })
      // 查询机构账户信息
      ajax.post('prodL.1.4.json', {
        pd_no: 0,
        pd_status_str: ' ',
        row_count: -1
      }).then(resp => {
        let results = resp.map(item => {
          return {
            label: item.pd_code + ':' + item.pd_name,
            value: item.pd_no,
            status: item.pd_status
          }
        })
        commit('setProducts', results)
      })
      // 查询通道信息
      ajax.post('pubL.3.153.json', {
        pass_no: 0,
        pass_type: 0,
        pass_status: ' ',
        row_count: -1
      }).then(resp => {
        let results = resp.map(item => {
          return {
            label: item.pass_name,
            value: item.pass_no,
            status: item.pass_status
          }
        })
        commit('setChannels', results)
      })
      // 查询资产账户
      ajax.post('prodL.1.44.json', {
        pd_no: 0,
        asset_acco_no: 0,
        asset_acco_status_str: ' ',
        asset_acco_type: 0,
        asset_acco_type: 0,
        row_count: -1
      }).then(resp => {
        let results = resp.map(item => {
          return {
            label: item.asset_acco + ':' + item.asset_acco_name,
            value: item.asset_acco_no,
            status: item.asset_acco_status,
            pd_no: item.pd_no
          }
        })
        commit('setAssets', results)
      })
      // 查询交易账户
      ajax.post('prodL.1.83.json', {
        exch_group_no: 0,
        pd_no: 0,
        asset_acco_no: 0,
        exch_group_status_str: ' ',
        row_count: -1
      }).then(resp => {
        let results = resp.map(item => {
          return {
            label: item.exch_group_code + ':' + item.exch_group_name,
            value: item.exch_group_no,
            status: item.exch_group_status,
            pd_no: item.pd_no,
            asset_acco_no: item.asset_acco_no
          }
        })
        commit('setExchGroups', results)
      })
      //查币对
      ajax.post('pubL.1.49.json', {
        exch_no: 1,
        time_stamp: 0,
        row_count: -1
      }).then(resp => {
        commit('setSymbols', resp.map(item => {
          return {
            'base_crncy_type': item.base_crncy_type,
            'quote_crncy_type': item.quote_crncy_type,
            'label': item.base_crncy_type + '/' + item.quote_crncy_type,
            'value': item.stock_code
          }
        }))
      })
      // 查用户自定义维度
      ajax.post('rksecuL.3.6.json', {}).then(resp => {
        commit('setUserDimensions', resp.map(item => {
          return {
            'label': item.dime_type_name,
            'value': item.dime_type_code
          }
        }))
      })
      // 查询系统自定义维度
      ajax.post('rksecuL.3.1.json').then(resp => {
        commit('setSystemDimensions', resp.map(item => {
          return {
            'label': item.dime_type_name,
            'value': item.dime_type_code
          }
        }))
      })
      // 查询风控items
      ajax.post('rksecuL.1.5.json', {
        row_count: -1
      }).then(resp => {
        commit('setRiskItems', resp.map(item => {
          return {
            label: item.risk_item_name,
            value: item.row_id,
            risk_rule_type: item.risk_rule_type
          }
        }))
      })
      // 查询风控模板
      ajax.post('rksecuL.1.9.json', {
        row_count: -1
      }).then(resp => {
        commit('setRiskTemplates', resp.map(item => {
          return {
            label: item.model_name,
            value: item.row_id
          }
        }))
      })
    }
  }
}
