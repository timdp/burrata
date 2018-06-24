;(() => {
  const { Server } = window.burrata

  const NAMESPACE = 'demo'

  // Number of iframes
  const DESIRED_CLIENT_COUNT = 2

  // Protocol
  const PING_REQUEST = 'ping'
  const PING_RESPONSE = 'pong'
  const HANDSHAKE_REQUEST = 'handshake'
  const HANDSHAKE_VERSION = '1.0.0'
  const START_REQUEST = 'start'

  const server = new Server({ ns: NAMESPACE })

  window.setUpLog(server)

  server.setHandler(PING_REQUEST, async (args, client) => {
    server.log(
      `Received ${PING_REQUEST} from ${client} with args: ${JSON.stringify(
        args
      )}`
    )
    server.log(`Responding with ${PING_RESPONSE}`)
    return 'pong'
  })

  const performHandshake = async client => {
    server.log(`Performing handshake with ${client}`)
    let response
    try {
      response = await client.send(HANDSHAKE_REQUEST, {
        version: HANDSHAKE_VERSION
      })
    } catch (err) {
      server.log(`Failed to perform handshake with ${client}: ${err}`)
      return
    }
    server.log(`Handshake response from ${client}: ${JSON.stringify(response)}`)
  }

  const broadcastMessageToClients = async () => {
    server.log(`Broadcasting ${START_REQUEST} to all clients`)
    let responses
    try {
      responses = await server.broadcast(START_REQUEST, { when: 'now' })
    } catch (err) {
      server.log(`Failed to broadcast: ${err}`)
      return
    }
    server.log(`Responses to ${START_REQUEST}: ${JSON.stringify(responses)}`)
  }

  const onConnect = ({ detail: { node } }) => {
    server.log(`Client ${node} connected`)
    const clientIds = Object.keys(server.clients)
    const allReady = clientIds.length === DESIRED_CLIENT_COUNT
    performHandshake(node).then(() => {
      if (allReady) {
        server.log(`${DESIRED_CLIENT_COUNT} clients connected`)
        server.removeEventListener('connect', onConnect)
        broadcastMessageToClients()
      }
    })
  }

  server.addEventListener('connect', onConnect)

  server.init()
})()
