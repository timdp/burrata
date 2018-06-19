import defer from 'p-defer'
import { Master } from '../../src'

const FIXTURES_URL = (() => {
  const alternatives = {
    localhost: '127.0.0.1',
    '127.0.0.1': 'localhost'
  }
  const { hostname, port } = window.location
  const base = '//' + (alternatives[hostname] || hostname) + ':' + port
  return base + '/base/test/fixtures'
})()
const SLAVE_URL = FIXTURES_URL + '/slave.html'

let masterCount = 0

const newNamespace = () => 'm' + ++masterCount

export const createIframe = (url, config) => {
  const iframe = document.createElement('iframe')
  iframe.src = url + '#' + encodeURIComponent(JSON.stringify(config))
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  return iframe
}

const setUpSlaves = async (master, numSlaves) => {
  if (numSlaves <= 0) {
    return
  }
  const dfd = defer()
  const slaves = []
  const iframes = []
  const onConnect = ({ detail: { node } }) => {
    slaves.push(node)
    if (slaves.length === numSlaves) {
      master.removeEventListener('connect', onConnect)
      dfd.resolve()
    }
  }
  master.addEventListener('connect', onConnect)
  for (let num = 1; num <= numSlaves; ++num) {
    const id = 's' + num
    const iframe = createIframe(SLAVE_URL, { ns: master.ns, id })
    iframes.push(iframe)
  }
  await dfd.promise
  return [slaves, iframes]
}

export const setUpMasterWithSlaves = async (numSlaves, ns = newNamespace()) => {
  const master = new Master({ ns })
  const settingUpSlaves = setUpSlaves(master, numSlaves)
  master.init()
  const [slaves, iframes] = await settingUpSlaves
  return {
    master,
    slave: slaves[0],
    slaves,
    dispose: () => {
      master.dispose()
      iframes.filter(iframe => iframe.parentNode).forEach(iframe => {
        iframe.parentNode.removeChild(iframe)
      })
    }
  }
}

export const setUpMasterWithSlave = (ns = newNamespace()) =>
  setUpMasterWithSlaves(1, ns)
