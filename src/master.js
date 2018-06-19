import { Node } from './node'
import { Stub } from './stub'
import { Receiver } from './receiver'

const ID = ''

class SlaveStub extends Stub {}

class Master extends Node {
  constructor ({ ns, source = window, origin } = {}) {
    super({ ns, id: ID, source, origin })
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

  async broadcast (type, args = {}) {
    const slaves = Object.values(this._slaves)
    const responses = await Promise.all(
      slaves.map(slave => slave.send(type, args))
    )
    const result = {}
    for (let i = 0; i < slaves.length; ++i) {
      result[slaves[i].id] = responses[i]
    }
    return result
  }

  _accept (id, target) {
    const node = new SlaveStub(this, { id, target })
    this._slaves[id] = node
    return node
  }

  _resolve (id) {
    return this._slaves[id]
  }
}

export { Master }
