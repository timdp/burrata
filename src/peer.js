class Peer extends EventTarget {
  constructor (id, target, origin) {
    super()
    this._id = id
    this._target = target
    this._origin = origin
    this._handlers = {}
    this._sender = null
    this._receiver = null
    Peer.instances[id] = this
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

  get sender () {
    return this._sender
  }

  get receiver () {
    return this._receiver
  }

  log (message) {
    const evt = new CustomEvent('log', {
      detail: {
        message
      }
    })
    this.dispatchEvent(evt)
  }

  setHandler (type, handler) {
    this._handlers[type] = handler
  }

  async handle (type, args, source) {
    if (!this._handlers.hasOwnProperty(type)) {
      throw new Error(`Unknown command: ${type}`)
    }
    return this._handlers[type](args, source)
  }

  _init (sender, receiver) {
    this._sender = sender
    this._receiver = receiver
  }

  _send (type, id, payload = {}) {
    this._sender._send(type, id, payload)
  }

  async _receive (id) {
    return this._receiver._receive(id)
  }
}

Peer.instances = {}

export { Peer }
