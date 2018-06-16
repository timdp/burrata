import { Peer } from './peer'
import { Receiver } from './receiver'
import { Sender } from './sender'

class Slave extends Peer {
  constructor (id, target = window.parent, origin = '*') {
    super(id, target, origin)
    this._init(new Sender(this), new Receiver(this))
  }

  async init () {
    this._receiver.init()
    await this._sender.init()
  }

  dispose () {
    this._receiver.dispose()
  }

  async send (type, args = {}) {
    return this._sender.send(type, args)
  }

  toString () {
    return `Slave#${this.id}`
  }
}

export { Slave }
