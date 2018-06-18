import { Node } from './node'
import { Receiver } from './receiver'
import { Sender } from './sender'

class Slave extends Node {
  constructor (ns, id, target = window.parent, origin = '*') {
    super(ns, id, target, origin)
    this._init(new Sender(this), new Receiver(this))
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

  toString () {
    return `Slave{ns=${this.ns},id=${this.id}}`
  }
}

export { Slave }
