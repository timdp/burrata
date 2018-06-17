import { Node } from './node'
import { Receiver } from './receiver'
import { Sender } from './sender'

class SlaveStub extends Node {
  constructor (master, id, target, origin) {
    super(id, target, origin)
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

class Master extends Node {
  constructor (target = window, origin = '*') {
    super('', target, origin)
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
      result[slaves[i].id] = responses[i]
    }
    return result
  }

  _accept (id, win) {
    const node = new SlaveStub(this, id, win, '*')
    this._slaves[id] = node
    return node
  }
}

export { Master }
