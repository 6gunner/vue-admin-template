import emitter from './emitter'

export default class {
  constructor (connectionUrl, opts = {}) {
    this.format = opts.format && opts.format.toLowerCase()
    this.connectionUrl = connectionUrl
    this.opts = opts

    this.reconnection = this.opts.reconnection || false
    this.reconnectionAttempts = this.opts.reconnectionAttempts || Infinity
    this.reconnectionDelay = this.opts.reconnectionDelay || 1000
    this.reconnectTimeoutId = 0
    this.reconnectionCount = 0

    this.connect(connectionUrl, opts)

    if (opts.store) { this.store = opts.store }
    this.onEvent()
  }

  connect (connectionUrl, opts = {}) {
    let protocol = opts.protocol || ''
    this.WebSocket = protocol === '' ? new WebSocket(connectionUrl) : new WebSocket(connectionUrl, protocol)
    this.WebSocket.binaryType = 'arraybuffer'
    if (this.format === 'json') {
      if (!('sendObj' in this.WebSocket)) {
        this.WebSocket.sendObj = (obj) => this.WebSocket.send(JSON.stringify(obj))
      }
    }
    return this.WebSocket
  }

  reconnect () {
    if (this.reconnectionCount <= this.reconnectionAttempts) {
      this.reconnectionCount++
      clearTimeout(this.reconnectTimeoutId)

      this.reconnectTimeoutId = setTimeout(() => {
        if (this.store) { this.passToStore('SOCKET_RECONNECT', this.reconnectionCount) }

        this.connect(this.connectionUrl, this.opts)
        this.onEvent()
      }, this.reconnectionDelay)
    } else {
      if (this.store) { this.passToStore('SOCKET_RECONNECT_ERROR', true) }
    }
  }

  onEvent () {
    ['onmessage', 'onclose', 'onerror', 'onopen'].forEach((eventType) => {
      this.WebSocket[eventType] = (event) => {
        emitter.emit(eventType, event)

        if (this.store) { this.passToStore('SOCKET_' + eventType, event) }

        if (this.reconnection && this.eventType === 'onopen') { this.reconnectionCount = 0 }

        if (this.reconnection && eventType === 'onclose') { this.reconnect(event) }
      }
    })
  }

  passToStore (eventName, payload) {
    if (!eventName.startsWith('SOCKET_')) { return }
    // if (this.format === 'json' && event.data) {
    //   msg = JSON.parse(event.data)
    // }
    for (let namespaced in this.store._mutations) {
      let mutation = namespaced.split('/').pop()
      if (mutation === eventName.toUpperCase()) this.store.commit(namespaced, payload)
    }

    for (let namespaced in this.store._actions) {
      let action = namespaced.split('/').pop()

      if (!action.startsWith('socket_')) continue

      let camelcased = 'socket_' + payload.toLowerCase()
        .replace('SOCKET_', '')
        .replace(/[\W\s_]+(\w)/g, (match, p1) => p1.toUpperCase())

      if (action === camelcased) this.store.dispatch(namespaced, payload)
    }
  }
}
