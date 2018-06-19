import { Node } from './node'
import { Stub } from './stub'
import { Receiver } from './receiver'
import { Sender } from './sender'

class PeerStub extends Stub {}

class Peer extends Node {
  constructor ({ ns, id, source = window, target = window, origin } = {}) {
    super({ ns, id, source, target, origin })
    this._other = null
    this._init(new Sender(this), new Receiver(this))
  }

  get other () {
    return this._other
  }

  async init () {
    this._receiver.init()
    await this._sender.init()
  }

  dispose () {
    this._receiver.dispose()
    this._other = null
  }

  async send (type, args = {}) {
    return this._sender.send(type, args)
  }

  _accept (id, target) {
    if (this._other != null) {
      throw new Error(`Peer already connected: ${this._other}`)
    }
    const node = new PeerStub(this, { id, target })
    this._other = node
    return node
  }

  _resolve (id) {
    return id === this._other.id ? this._other : null
  }
}

export { Peer }
