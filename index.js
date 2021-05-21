'use strict'

const uWebSockets = require('uWebSockets.js')
const UWSRoomManager = require('./lib/api')
const serve = require('./server')

/**
 * @desc this is the default export
 * @param {BouncerConfig} userConfig
 * @type {BouncerJs}
 */
class BouncerJs extends UWSRoomManager {
  constructor(userConfig = {}) {
    super(userConfig)

    if (this.config.debug) {
      console.info(`${this.config.logo} with config:`, this.config)
    }

    this.router = this.createRouter()
    this.router
      .ws('/*', {
        message: (ws, message) => this.onMessage(ws, message),
        close: (ws) => this.onClose(ws)
      })
      .listen(parseInt(this.config.port), (listenSocket) =>
        this.onListen(listenSocket)
      )
  }

  createRouter() {
    // if user provides ssl in configuration
    // SSLApp is started
    // otherwise App is started
    const startRouter = this.config.ssl ? uWebSockets.SSLApp : uWebSockets.App
    const ssl = this.config.ssl || {}

    return startRouter({
      key_file_name: ssl.key,
      cert_file_name: ssl.cert,
      passphrase: ssl.passphrase
    })
  }

  /**
   * @param {number} port
   */
  onListen(listenSocket) {
    if (listenSocket) {
      const plugins = Object.keys(this.config.plugins)

      if (plugins.length) {
        console.info(
          `${this.config.logo} with: ${plugins.join(', ')} on port: ${
            this.config.port
          }`
        )
      } else {
        console.info(`${this.config.logo} on port: ${this.config.port}`)
      }
    }
  }

  /**
   * @desc on disconnect leave socket ws.topic
   * @param {WebSocket} ws
   */
  onClose(ws) {
    try {
      for (const topic of ws.topics) {
        this.leave(ws, topic)
      }
    } catch (err) {
      // socket already closed
    }
  }

  /**
   * @desc this is Join + run plugins + leave
   * @param {WebSocket} ws
   * @param {ArrayBuffer} message
   */
  onMessage(ws, message) {
    const utf8 = Buffer.from(message).toString()

    try {
      const { event, data } = JSON.parse(utf8)

      // Optional join: sets ws.topic
      if (event === this.config.join) {
        this.join(ws, data)
      }

      // Optional leave: removes ws.topic
      if (event === this.config.leave) {
        this.leave(ws, data)
      }

      this.onEvent(ws, event, data)
    } catch (err) {
      console.error(err)
    }
  }

  serve(dist = 'dist') {
    return serve(dist, this)
  }
}

module.exports = BouncerJs
