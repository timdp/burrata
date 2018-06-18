import EventTarget from 'event-target-shim'
import CustomEvent from 'custom-event'

const instances = {}

class Node extends EventTarget {
  static get instances () {
    return instances
  }

  constructor (id, target, origin) {
    super()
    this._id = id
    this._target = target
    this._origin = origin
    this._handlers = {}
    this._sender = null
    this._receiver = null
    instances[id] = this
  }

  get id () {
    return this._id
  }

  get target () {
    return this._target
  }

  get origin () {
    return this._origin
  }

  log (message) {
    this._dispatchEvent('log', { message })
  }

  setHandler (type, handler) {
    this._handlers[type] = handler
  }

  async _handle (type, args, source) {
    if (!this._handlers.hasOwnProperty(type)) {
      throw new Error(`Unknown command: ${type}`)
    }
    return this._handlers[type](args, source)
  }

  _init (sender, receiver) {
    this._sender = sender
    this._receiver = receiver
  }

  async _respond (id, response) {
    await this._sender.respond(id, response)
  }

  async _receive (id) {
    return this._receiver.receive(id)
  }

  _dispatchError (error) {
    this._dispatchEvent('error', { error })
  }

  _dispatchEvent (type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }))
  }
}

export { Node }
