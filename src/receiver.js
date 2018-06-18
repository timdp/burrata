import defer from 'p-defer'
import { Node } from './node'
import { serializeError, deserializeError, noop } from './util'

const REQUIRED_DATA_PROPERTIES = ['type', 'from', 'id', 'payload']

const commands = {}

const isValidMessage = data =>
  !REQUIRED_DATA_PROPERTIES.some(name => data[name] == null) &&
  commands.hasOwnProperty(data.type)

class Receiver {
  constructor (node) {
    this._node = node
    this._dfds = {}
    this._onMessage = this._onMessage.bind(this)
  }

  init () {
    window.addEventListener('message', this._onMessage)
  }

  dispose () {
    window.removeEventListener('message', this._onMessage)
  }

  async receive (id) {
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
    if (data == null || typeof data !== 'object' || !isValidMessage(data)) {
      // TODO Handle
      return
    }
    const command = commands[data.type]
    command.call(this, data, evt.source).catch(err => {
      this._node._dispatchError(
        new Error(`Failed to process ${data.type}: ${err}`)
      )
    })
  }
}

Object.assign(commands, {
  async connect ({ id, from }, source) {
    let slave
    try {
      slave = this._node._accept(from, source)
    } catch (err) {
      this._node._dispatchError(
        new Error(`Failed to accept connection: ${err}`)
      )
      return
    }
    this._node._dispatchEvent('connect', { slave })
    await slave._respond(id)
  },

  async request ({ id, from, payload: { type, args } }) {
    if (!Node.instances.hasOwnProperty(from)) {
      // TODO Handle
      return
    }
    const source = Node.instances[from]
    let result = null
    let error = null
    try {
      result = await this._node._handle(type, args, source)
    } catch (err) {
      error = serializeError(err)
    } finally {
      await source._respond(id, { error, result })
    }
  },

  async response ({ id, from, payload: { error, result } }) {
    if (!this._dfds.hasOwnProperty(id)) {
      // TODO Handle
      return
    }
    const { resolve, reject } = this._dfds[id]
    delete this._dfds[id]
    if (error != null) {
      reject(deserializeError(error))
    } else {
      resolve(result)
    }
  }
})

export { Receiver }
