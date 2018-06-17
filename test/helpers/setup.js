import defer from 'p-defer'
import { Master } from '../../src'

const SLAVE_URL = (() => {
  const alternatives = {
    'localhost': '127.0.0.1',
    '127.0.0.1': 'localhost'
  }
  const { hostname, port } = window.location
  const base = '//' + (alternatives[hostname] || hostname) + ':' + port
  return base + '/base/test/fixtures/slave.html'
})()

let masterCount = 0

export const setUpSlave = id => {
  const config = { id }
  const iframe = document.createElement('iframe')
  iframe.src = SLAVE_URL + '#' + encodeURIComponent(JSON.stringify(config))
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  return iframe
}

export const setUpMasterWithSlaves = async numSlaves => {
  const ns = ++masterCount
  const master = new Master()
  if (numSlaves <= 0) {
    master.init()
    return [master]
  }
  const dfd = defer()
  const slaves = []
  const onConnect = ({ detail: { slave } }) => {
    slaves.push(slave)
    if (slaves.length === numSlaves) {
      master.removeEventListener('connect', onConnect)
      dfd.resolve()
    }
  }
  master.addEventListener('connect', onConnect)
  for (let id = 1; id <= numSlaves; ++id) {
    setUpSlave(`${ns}:${id}`)
  }
  master.init()
  await dfd.promise
  return [master, ...slaves]
}

export const setUpMasterWithSlave = () => setUpMasterWithSlaves(1)
