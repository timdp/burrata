let count = 0

class Sender {
  constructor (peer) {
    this._peer = peer
    this._id = count++
    this._msgId = 0
  }

  async init () {
    return this._sendAndReceive('connect')
  }

  async send (type, args) {
    return this._sendAndReceive('request', { type, args })
  }

  async _sendAndReceive (command, payload = {}) {
    const msgId = this._msgId++
    const id = `${this._id}:${msgId}`
    const receiving = this._peer._receive(id)
    this._send(command, id, payload)
    return receiving
  }

  _send (type, id, payload = {}) {
    const { id: from, target, origin } = this._peer
    const msg = JSON.stringify({ type, from, id, payload })
    target.postMessage(msg, origin)
  }
}

export { Sender }
