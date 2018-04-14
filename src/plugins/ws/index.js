// websocket插件，组件访问通过this.$socket

import Observer from './observer'
import emitter from './emitter'

export default {

  install (Vue, connection, opts = {}) {
    if (!connection) { throw new Error('the websocket connection is undefined') }

    let observer = new Observer(connection, opts)

    Vue.prototype.$socket = observer.WebSocket

    Vue.mixin({
      created () {
        let vm = this
        let sockets = this.$options['sockets']

        this.$options.sockets = new Proxy({}, {
          set (target, key, value) {
            emitter.addListener(key, value, vm)
            target[key] = value
            return true
          },
          deleteProperty (target, key) {
            emitter.removeListener(key, vm.$options.sockets[key], vm)
            delete target.key
            return true
          }
        })

        if (sockets) {
          Object.keys(sockets).forEach((key) => {
            this.$options.sockets[key] = sockets[key]
          })
        }
      },
      beforeDestroy () {
        let sockets = this.$options['sockets']
        clearTimeout(observer.reconnectTimeoutId)

        if (sockets) {
          Object.keys(sockets).forEach((key) => {
            delete this.$options.sockets[key]
          })
        }
      }
    })
  }
}
