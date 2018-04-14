// websocket 主推的数据一起管理在这
export default {
  namespaced: true,
  state: {
    isConnected: false,
    listeners: {},
    withdrawRecords: [],
    exchGroupPositions: []
  },
  getters: {},
  mutations: {
    SOCKET_ONOPEN (state) {
      state.isConnected = true
      console.log('行情主推连接成功')
    },

    SOCKET_ONCLOSE (state) {
      state.isConnected = false
      console.log('行情主推断开连接')
    },

    SOCKET_RECONNECT (state) {
      console.log('行情主推连接已断开，正在重新连接')
    },

    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    SOCKET_ONMESSAGE (state, event) {
      let msg = JSON.parse(event.data)
      if (msg.api) {
        let data = JSON.parse(msg.content)
        for (let funcCode in state.listeners) {
          if (data && data.functionId === funcCode) {
            state.listeners[funcCode].forEach(handler => {
              handler(data)
            })
          }
        }
      }
    },
    SUBSCRIBE (state, {funcCode, handler}) {
      let listeners = state.listeners
      if (_.isArray(funcCode)) {
        funcCode.forEach(code => {
          if (!listeners[code]) {
            listeners[code] = []
          }
          listeners[code].push(handler)
        })
      } else {
        if (!listeners[funcCode]) {
          listeners[funcCode] = []
        }
        listeners[funcCode].push(handler)
      }
      state.listeners = listeners
    },

    addWithdrawRecord (state, data) {
      let withdrawRecords = _.clone(state.withdrawRecords)
      withdrawRecords.unshift(data)
      state.withdrawRecords = withdrawRecords
    },
    setWithdrawRecords (state, data) {
      state.withdrawRecords = data
    },
    setExchGroupPositions (state, data) {
      state.exchGroupPositions = data
    },
    updateExchGroupPosition (state, data) {
      let exchGroupPositions = state.exchGroupPositions
      let temp = []
      exchGroupPositions.forEach((position, index) => {
        if (position.asset_acco_no === data.asset_acco_no &&
          position.exch_group_no === data.exch_group_no && position.base_crncy_type === data.base_crncy_type) {
          position = {
            ...position,
            curr_qty: data.exgp_curr_qty,
            frozen_qty: data.exgp_frozen_qty,
            strike_capt_qty: data.exgp_strike_capt_qty,
            strike_releas_qty: data.exgp_strike_releas_qty,
            trade_capt_qty: data.exgp_trade_capt_qty,
            trade_releas_qty: data.exgp_trade_releas_qty,
            unfroz_qty: data.exgp_unfroz_qty
          }
        }
        temp.push(position)
      })
      state.exchGroupPositions = temp
    }
  },
  actions: {

  }
}
