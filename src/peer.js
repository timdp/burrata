import { Duplex } from './duplex'
import { Stub } from './stub'

class PeerStub extends Stub {}

class Peer extends Duplex {
  constructor ({ ns, id, source = window, target = window, origin } = {}) {
    super({ ns, id, source, target, origin })
    this._other = null
  }

  get other () {
    return this._other
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
