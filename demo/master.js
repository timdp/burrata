;(() => {
  const { Master } = window.burrata

  const NAMESPACE = 'demo'

  // Number of iframes
  const DESIRED_SLAVE_COUNT = 2

  // Protocol
  const PING_REQUEST = 'ping'
  const PING_RESPONSE = 'pong'
  const HANDSHAKE_REQUEST = 'handshake'
  const HANDSHAKE_VERSION = '1.0.0'
  const START_REQUEST = 'start'

  const master = new Master(NAMESPACE)

  window.setUpLog(master)

  master.setHandler(PING_REQUEST, async (args, slave) => {
    master.log(
      `Received ${PING_REQUEST} from ${slave} with args: ${JSON.stringify(
        args
      )}`
    )
    master.log(`Responding with ${PING_RESPONSE}`)
    return 'pong'
  })

  const performHandshake = async slave => {
    master.log(`Performing handshake with ${slave}`)
    let response
    try {
      response = await slave.send(HANDSHAKE_REQUEST, {
        version: HANDSHAKE_VERSION
      })
    } catch (err) {
      master.log(`Failed to perform handshake with ${slave}: ${err}`)
      return
    }
    master.log(`Handshake response from ${slave}: ${JSON.stringify(response)}`)
  }

  const broadcastMessageToSlaves = async () => {
    master.log(`Broadcasting ${START_REQUEST} to all slaves`)
    let responses
    try {
      responses = await master.broadcast(START_REQUEST, { when: 'now' })
    } catch (err) {
      master.log(`Failed to broadcast: ${err}`)
      return
    }
    master.log(`Responses to ${START_REQUEST}: ${JSON.stringify(responses)}`)
  }

  const onConnect = ({ detail: { slave } }) => {
    master.log(`Slave ${slave} connected`)
    const slaveIds = Object.keys(master.slaves)
    const allReady = slaveIds.length === DESIRED_SLAVE_COUNT
    performHandshake(slave).then(() => {
      if (allReady) {
        master.log(`${DESIRED_SLAVE_COUNT} slaves connected`)
        master.removeEventListener('connect', onConnect)
        broadcastMessageToSlaves()
      }
    })
  }

  master.addEventListener('connect', onConnect)

  master.init()
})()
