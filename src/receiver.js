import CustomEvent from 'custom-event'
import defer from 'p-defer'
import serializeError from 'serialize-error'
import { Node } from './node'

const REQUIRED_DATA_PROPERTIES = ['type', 'from', 'id', 'payload']
const ERROR_PROPERTIES = ['name', 'stack']

const noop = () => {}

const hydrateError = error => {
  const err = new Error(error.message)
  ERROR_PROPERTIES.forEach(name => {
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
  return err
}

class Receiver {
  constructor (node) {
    this._node = node
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
      const dfd = defer()
      dfd.promise.catch(noop)
      this._dfds[id] = dfd
    }
    return this._dfds[id].promise
  }

  _onMessage (evt) {
    let data = null
    try {
      data = JSON.parse(evt.data)
    } catch (err) {}
    if (
      data == null ||
      typeof data !== 'object' ||
      REQUIRED_DATA_PROPERTIES.some(name => data[name] == null) ||
      !this._commands.hasOwnProperty(data.type)
    ) {
      // TODO Warn
      return
    }
    this._commands[data.type](data, evt.source).catch(err => {
      this._dispatchError(new Error(`Failed to process ${data.type}: ${err}`))
    })
  }

  async _handleConnect ({ id, from }, source) {
    let slave
    try {
      slave = this._node._accept(from, source)
    } catch (err) {
      this._dispatchError(new Error(`Failed to accept connection: ${err}`))
      return
    }
    this._dispatchEvent('connect', { slave })
    await slave._send('response', id)
  }

  async _handleRequest ({ id, from, payload: { type, args } }) {
    if (!Node.instances.hasOwnProperty(from)) {
      // TODO Warn
      return
    }
    const node = Node.instances[from]
    let result = null
    let error = null
    try {
      result = await this._node.handle(type, args, node)
    } catch (err) {
      error = { message: '' + err }
      try {
        error = serializeError(err)
      } catch (_) {}
    } finally {
      await node._send('response', id, { error, result })
    }
  }

  async _handleResponse ({ id, from, payload: { error, result } }) {
    if (!this._dfds.hasOwnProperty(id)) {
      // TODO Warn
      return
    }
    const { resolve, reject } = this._dfds[id]
    delete this._dfds[id]
    if (error != null) {
      reject(hydrateError(error))
    } else {
      resolve(result)
    }
  }

  _dispatchError (error) {
    this._dispatchEvent('error', { error })
  }

  _dispatchEvent (type, detail) {
    this._node.dispatchEvent(new CustomEvent(type, { detail }))
  }
}

export { Receiver }
