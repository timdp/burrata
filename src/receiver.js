import CustomEvent from 'custom-event'
import defer from 'p-defer'
import serializeError from 'serialize-error'
import { Peer } from './peer'

class Receiver {
  constructor (peer) {
    this._peer = peer
    this._dfds = {}
    this._onMessage = this._onMessage.bind(this)
    this._commands = {
      connect: this._handleConnect.bind(this),
      request: this._handleRequest.bind(this),
      response: this._handleResponse.bind(this)
    }
  }

  init () {
    window.addEventListener('message', this._onMessage)
  }

  dispose () {
    window.removeEventListener('message', this._onMessage)
  }

  async _receive (id) {
    if (!this._dfds.hasOwnProperty(id)) {
      this._dfds[id] = defer()
    }
    return this._dfds[id].promise
  }

  _onMessage (evt) {
    let data = null
    try {
      data = JSON.parse(evt.data)
    } catch (err) {}
    if (data == null ||
        data.type == null ||
        !this._commands.hasOwnProperty(data.type) ||
        data.from == null ||
        data.id == null ||
        data.payload == null) {
      return
    }
    this._commands[data.type](data, evt.source)
  }

  async _handleConnect ({ id, from }, source) {
    const slave = this._peer._accept(from, source)
    slave._send('response', id)
    const evt = new CustomEvent('connect', {
      detail: {
        slave
      }
    })
    this._peer.dispatchEvent(evt)
  }

  async _handleRequest ({ id, from, payload: { type, args } }) {
    if (!Peer.instances.hasOwnProperty(from)) {
      return
    }
    const peer = Peer.instances[from]
    let result = null
    let error = null
    try {
      result = await this._peer.handle(type, args, peer)
    } catch (err) {
      error = { message: '' + err }
      try {
        error = serializeError(err)
      } catch (_) {}
    } finally {
      peer._send('response', id, { error, result })
    }
  }

  async _handleResponse ({ id, from, payload: { error, result } }) {
    if (!this._dfds.hasOwnProperty(id)) {
      return
    }
    const { resolve, reject } = this._dfds[id]
    delete this._dfds[id]
    if (error != null) {
      const err = new Error(error.message)
      ;['name', 'stack'].forEach(name => {
        const value = error[name]
        try {
          Object.defineProperty(err, name, {
            configurable: true,
            enumerable: false,
            value,
            writable: true
          })
        } catch (_) {}
      })
      reject(err)
    } else {
      resolve(result)
    }
  }
}

export { Receiver }
