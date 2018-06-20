import { Node } from './node'
import { Receiver } from './receiver'
import { Sender } from './sender'

class Duplex extends Node {
  constructor ({ ns, id, source, target, origin }) {
    super({ ns, id, source, target, origin })
    this._init(new Sender(this), new Receiver(this))
  }

  async init () {
    this.listen()
    await this.connect()
  }

  listen () {
    this._receiver.init()
  }

  async connect () {
    await this._sender.init()
  }

  dispose () {
    this._receiver.dispose()
  }

  async send (type, args) {
    return this._sender.send(type, args)
  }
}

export { Duplex }
