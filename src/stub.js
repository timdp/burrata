import { Sender } from './sender'
import { Node } from './node'

class Stub extends Node {
  constructor (owner, { id, target, origin }) {
    super({
      ns: owner.ns,
      id,
      from: owner.id,
      source: owner.target,
      target,
      origin
    })
    this._owner = owner
    this._init(new Sender(this), owner._receiver)
  }

  get owner () {
    return this._owner
  }

  async send (type, args = {}) {
    return this._sender.send(type, args)
  }
}

export { Stub }
