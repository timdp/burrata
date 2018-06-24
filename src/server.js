import { Node } from './node'
import { Stub } from './stub'
import { Receiver } from './receiver'
import { SERVER_ID } from './constants'

class ClientStub extends Stub {}

class Server extends Node {
  constructor ({ ns, source = window, origin } = {}) {
    super({ ns, id: SERVER_ID, source, origin })
    this._clients = {}
    this._init(null, new Receiver(this))
  }

  get clients () {
    return this._clients
  }

  init () {
    this.listen()
  }

  listen () {
    this._receiver.init()
  }

  dispose () {
    this._receiver.dispose()
    this._clients = {}
  }

  async broadcast (type, args = {}) {
    const clients = Object.values(this._clients)
    const responses = await Promise.all(
      clients.map(client => client.send(type, args))
    )
    const result = {}
    for (let i = 0; i < clients.length; ++i) {
      result[clients[i].id] = responses[i]
    }
    return result
  }

  _accept (id, target) {
    const node = new ClientStub(this, { id, target })
    this._clients[id] = node
    return node
  }

  _resolve (id) {
    return this._clients[id]
  }
}

export { Server }
