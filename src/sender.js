class Sender {
  constructor (node) {
    this._node = node
    this._msgId = 0
  }

  async init () {
    await this._rawSend('connect')
  }

  async send (type, args) {
    return this._rawSend('request', { type, args })
  }

  respond (id, response) {
    this._postMessage('response', id, response)
  }

  toString () {
    return `${this._node}#Sender`
  }

  async _rawSend (type, payload = {}) {
    const msgId = this._msgId++
    const id = `${this._node.id}:${msgId}`
    const receiving = this._node._receive(id)
    this._postMessage(type, id, payload)
    return receiving
  }

  _postMessage (type, id, payload = {}) {
    const { ns, id: from, target, origin } = this._node
    const msg = JSON.stringify({ type, from, ns, id, payload })
    target.postMessage(msg, origin)
  }
}

export { Sender }
