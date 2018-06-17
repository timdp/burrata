(async () => {
  const { Slave } = window.burrata

  const SLAVE_ID = window.location.hash.substr(1)

  // Protocol
  const HANDSHAKE_REQUEST = 'handshake'
  const PING_REQUEST = 'ping'
  const START_REQUEST = 'start'
  const START_RESPONSE = 'started'

  const slave = new Slave(SLAVE_ID)

  window.setUpLog(slave)

  slave.setHandler(HANDSHAKE_REQUEST, async (args) => {
    slave.log(`Received ${HANDSHAKE_REQUEST} with args: ${JSON.stringify(args)}`)
    const { version } = args
    slave.log(`Responding with version: ${version}`)
    return version
  })

  slave.setHandler(START_REQUEST, async (args) => {
    slave.log(`Received ${START_REQUEST} with args: ${JSON.stringify(args)}`)
    slave.log(`Responding with ${START_RESPONSE}`)
    return START_RESPONSE
  })

  slave.log(`Connecting to master`)
  try {
    await slave.init()
  } catch (err) {
    slave.log(`Failed to connect to master: ${err}`)
    return
  }
  slave.log(`Connected to master, sending ${PING_REQUEST}`)
  let response
  try {
    response = await slave.send(PING_REQUEST, { demo: true })
  } catch (err) {
    slave.log(`Failed to send ${PING_REQUEST} to master: ${err}`)
    return
  }
  slave.log(`Master responded to ${PING_REQUEST} with ${JSON.stringify(response)}`)
})()
