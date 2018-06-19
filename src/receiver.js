import defer from 'p-defer'
import { serializeError, deserializeError, noop } from './util'

const REQUIRED_DATA_PROPERTIES = ['type', 'from', 'id', 'payload']

const commands = {}

const isValidMessage = data =>
  !REQUIRED_DATA_PROPERTIES.some(name => data[name] == null) &&
  commands.hasOwnProperty(data.type)

class Receiver {
  constructor (node) {
    if (node.source == null) {
      throw new Error(`${node} has no source`)
    }
    this._node = node
    this._dfds = {}
    this._onMessage = this._onMessage.bind(this)
  }

  init () {
    this._node.source.addEventListener('message', this._onMessage)
  }

  dispose () {
    this._node.source.removeEventListener('message', this._onMessage)
  }

  async receive (id) {
    if (!this._dfds.hasOwnProperty(id)) {
      const dfd = defer()
      dfd.promise.catch(noop)
      this._dfds[id] = dfd
    }
    return this._dfds[id].promise
  }

  toString () {
    return `${this._node}#${this.constructor.name}`
  }

  _onMessage (event) {
    let data = null
    try {
      data = JSON.parse(event.data)
    } catch (err) {}
    if (data == null || typeof data !== 'object') {
      // TODO Handle
      return
    }
    if (data.ns !== this._node.ns || data.from === this._node.id) {
      // TODO Handle
      return
    }
    if (!isValidMessage(data)) {
      this._node._dispatchEvent('warn', {
        message: `Invalid message from {ns=${data.ns},id=${
          data.from
        }}: ${JSON.stringify(data)}`
      })
      return
    }
    const command = commands[data.type]
    const { source, origin } = event
    this._node._dispatchEvent('receive', {
      data,
      source,
      origin
    })
    command.call(this, data, source).catch(error => {
      this._node._dispatchError(
        new Error(`Failed to process ${data.type}: ${error}`)
      )
    })
  }
}

Object.assign(commands, {
  async connect ({ id, from }, source) {
    let newNode
    try {
      newNode = this._node._accept(from, source)
    } catch (err) {
      this._node._dispatchError(
        new Error(`Failed to accept connection: ${err}`)
      )
      return
    }
    this._node._dispatchEvent('connect', { node: newNode })
    newNode._respond(id)
  },

  async request ({ ns, id, from, payload: { type, args } }) {
    const source = this._node._resolve(from)
    let result = null
    let error = null
    try {
      result = await this._node._handle(type, args, source)
    } catch (err) {
      error = serializeError(err)
    } finally {
      source._respond(id, { error, result })
    }
  },

  async response ({ ns, id, from, payload: { error, result } }) {
    if (!this._dfds.hasOwnProperty(id)) {
      this._node._dispatchEvent('warn', {
        message: `Failed to handle response from {ns=${ns},id=${from}}: unknown request ${JSON.stringify(
          id
        )}`
      })
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
