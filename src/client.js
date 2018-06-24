import { Duplex } from './duplex'
import { Stub } from './stub'
import { SERVER_ID } from './constants'

class ServerStub extends Stub {
  constructor (client) {
    super(client, { id: SERVER_ID, target: client.target })
  }
}

class Client extends Duplex {
  constructor ({ ns, id, source = window, target = window.parent, origin }) {
    super({ ns, id, source, target, origin })
    this._server = new ServerStub(this)
  }

  get server () {
    return this._server
  }

  _resolve (id) {
    return id === SERVER_ID ? this._server : null
  }
}

export { Client }
