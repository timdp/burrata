import { Node } from './node'
import { Stub } from './stub'
import { Receiver } from './receiver'
import { Sender } from './sender'

class MasterStub extends Stub {
  constructor (slave) {
    super(slave, { id: '', target: slave.target })
  }
}

class Slave extends Node {
  constructor ({ ns, id, source = window, target = window.parent, origin }) {
    super({ ns, id, source, target, origin })
    this._master = new MasterStub(this)
    this._init(new Sender(this), new Receiver(this))
  }

  get master () {
    return this._master
  }

  async init () {
    this._receiver.init()
    await this._sender.init()
  }

  dispose () {
    this._receiver.dispose()
  }

  async send (type, args) {
    return this._sender.send(type, args)
  }

  _resolve (id) {
    return id === '' ? this._master : null
  }
}

export { Slave }
