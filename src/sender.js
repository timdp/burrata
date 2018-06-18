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

  async respond (id, response) {
    await this._postMessage('response', id, response)
  }

  async _rawSend (type, payload = {}) {
    const msgId = this._msgId++
    const id = `${this._node.id}:${msgId}`
    const receiving = this._node._receive(id)
    this._postMessage(type, id, payload)
    return receiving
  }

  _postMessage (type, id, payload = {}) {
    const { id: from, target, origin } = this._node
    const msg = JSON.stringify({ type, from, id, payload })
    target.postMessage(msg, origin)
  }
}

export { Sender }
