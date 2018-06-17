class Sender {
  constructor (node) {
    this._node = node
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
    const id = `${this._node.id}:${msgId}`
    const receiving = this._node._receive(id)
    this._send(command, id, payload)
    return receiving
  }

  _send (type, id, payload = {}) {
    const { id: from, target, origin } = this._node
    const msg = JSON.stringify({ type, from, id, payload })
    target.postMessage(msg, origin)
  }
}

export { Sender }
