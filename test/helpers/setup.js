import defer from 'p-defer'
import { Server } from '../../src'

const FIXTURES_URL = (() => {
  const alternatives = {
    localhost: '127.0.0.1',
    '127.0.0.1': 'localhost'
  }
  const { hostname, port } = window.location
  const base = '//' + (alternatives[hostname] || hostname) + ':' + port
  return base + '/base/test/fixtures'
})()
const CLIENT_URL = FIXTURES_URL + '/client.html'

let serverCount = 0

const newNamespace = () => 'm' + ++serverCount

export const createIframe = (url, config) => {
  const iframe = document.createElement('iframe')
  iframe.src = url + '#' + encodeURIComponent(JSON.stringify(config))
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  return iframe
}

const setUpClients = async (server, numClients) => {
  if (numClients <= 0) {
    return
  }
  const dfd = defer()
  const clients = []
  const iframes = []
  const onConnect = ({ detail: { node } }) => {
    clients.push(node)
    if (clients.length === numClients) {
      server.removeEventListener('connect', onConnect)
      dfd.resolve()
    }
  }
  server.addEventListener('connect', onConnect)
  for (let num = 1; num <= numClients; ++num) {
    const id = 's' + num
    const iframe = createIframe(CLIENT_URL, { ns: server.ns, id })
    iframes.push(iframe)
  }
  await dfd.promise
  return [clients, iframes]
}

export const setUpServerWithClients = async (
  numClients,
  ns = newNamespace()
) => {
  const server = new Server({ ns })
  const settingUpClients = setUpClients(server, numClients)
  server.init()
  const [clients, iframes] = await settingUpClients
  return {
    server,
    client: clients[0],
    clients,
    dispose: () => {
      server.dispose()
      iframes.filter(iframe => iframe.parentNode).forEach(iframe => {
        iframe.parentNode.removeChild(iframe)
      })
    }
  }
}

export const setUpServerWithClient = (ns = newNamespace()) =>
  setUpServerWithClients(1, ns)
