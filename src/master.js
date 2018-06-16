import { Peer } from './peer'
import { Receiver } from './receiver'
import { Sender } from './sender'

class SlaveStub extends Peer {
  constructor (master, id, target) {
    super(id, target, '*')
    this._master = master
    this._init(new Sender(this), master.receiver)
  }

  async send (type, args = {}) {
    return this._sender.send(type, args)
  }

  toString () {
    return `Slave#${this.id}`
  }
}

class Master extends Peer {
  constructor (target = window) {
    super('', target, '*')
    this._slaves = {}
    this._init(null, new Receiver(this))
  }

  get slaves () {
    return this._slaves
  }

  init () {
    this._receiver.init()
  }

  dispose () {
    this._receiver.dispose()
    this._slaves = {}
  }

  toString () {
    return 'Master'
  }

  async broadcast (type, args = {}) {
    const slaves = Object.values(this._slaves)
    const responses = await Promise.all(
      slaves.map(slave => slave.send(type, args)))
    const result = {}
    for (let i = 0; i < slaves.length; ++i) {
      result[slaves[i]] = responses[i]
    }
    return result
  }

  _accept (id, win) {
    const peer = new SlaveStub(this, id, win)
    this._slaves[id] = peer
    return peer
  }
}

export { Master }
