class Sender {
  constructor (node) {
    if (node.target == null) {
      throw new Error(`${node} has no target`)
    }
    this._node = node
    this._msgId = 0
  }

  async init () {
    await this._sendWithAck('connect')
  }

  async send (type, args) {
    return this._sendWithAck('request', { type, args })
  }

  respond (id, response) {
    this._send('response', id, response)
  }

  toString () {
    return `${this._node}#${this.constructor.name}`
  }

  async _sendWithAck (type, payload = {}) {
    const msgId = this._msgId++
    const id = `${this._node.id}:${msgId}`
    const receiving = this._node._receive(id)
    this._send(type, id, payload)
    return receiving
  }

  _send (type, id, payload = {}) {
    const { ns, from } = this._node
    const data = { type, from, ns, id, payload }
    this._rawSend(data)
  }

  _rawSend (data) {
    const { target, origin } = this._node
    this._node._dispatchEvent('send', {
      data,
      target,
      origin
    })
    const msg = JSON.stringify(data)
    target.postMessage(msg, origin)
  }
}

export { Sender }
