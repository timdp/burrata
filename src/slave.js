import { Duplex } from './duplex'
import { Stub } from './stub'
import { MASTER_ID } from './constants'

class MasterStub extends Stub {
  constructor (slave) {
    super(slave, { id: MASTER_ID, target: slave.target })
  }
}

class Slave extends Duplex {
  constructor ({ ns, id, source = window, target = window.parent, origin }) {
    super({ ns, id, source, target, origin })
    this._master = new MasterStub(this)
  }

  get master () {
    return this._master
  }

  _resolve (id) {
    return id === MASTER_ID ? this._master : null
  }
}

export { Slave }
