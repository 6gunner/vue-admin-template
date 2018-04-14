// webscoket类
export default class{
  constructor (url, opts = {}) {
    this.connectionUrl = url
    this.opts = opts
    this.reconnection = this.opts.reconnection || false
    this.reconnectionAttempts = this.opts.reconnectionAttempts || Infinity
    this.reconnectionDelay = this.opts.reconnectionDelay || 1000
    this.reconnectTimeoutId = 0
    this.reconnectionCount = 0
    this.connect(url, opts)
    this.listeners = {}
    this.initEvent()
  }

  connect (connectionUrl, opts = {}) {
    this.webSocket = new WebSocket(connectionUrl)
    this.webSocket.binaryType = 'arraybuffer'
    if (!('sendObj' in this.webSocket)) {
      this.webSocket.sendObj = (obj) => this.webSocket.send(JSON.stringify(obj))
    }
    return this.webSocket
  }

  reconnect () {
    if (this.reconnectionCount <= this.reconnectionAttempts) {
      this.reconnectionCount++
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = setTimeout(() => {
        this.connect(this.connectionUrl, this.opts)
        this.onEvent()
      }, this.reconnectionDelay)
    }
  }

  initEvent () {
    ['onmessage', 'onopen', 'onclose', 'onerror'].forEach((eventType, index) => {
      this.listeners[eventType] = this.listeners[eventType] || []
      this.webSocket[eventType] = (event) => {
        this.listeners[eventType].forEach((handler) => {
          handler(event)
        })
        if (this.reconnection && this.eventType === 'onopen') {
          this.reconnectionCount = 0
        }
        if (this.reconnection && eventType === 'onclose') {
          this.reconnect(event)
        }
      }
    })
  }

  on (eventType, handler) {
    if (!['message', 'open', 'close', 'error'].includes(eventType)) {
      throw new Error('event type error')
    }
    let listeners = this.listeners['on'+eventType] || []
    listeners.push(handler)

    this.listeners['on'+eventType] = listeners
  }

}
