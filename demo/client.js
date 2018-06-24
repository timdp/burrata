;(async () => {
  const { Client } = window.burrata

  const NAMESPACE = 'demo'
  const CLIENT_ID = window.location.hash.substr(1)

  // Protocol
  const HANDSHAKE_REQUEST = 'handshake'
  const PING_REQUEST = 'ping'
  const START_REQUEST = 'start'
  const START_RESPONSE = 'started'

  const client = new Client({ ns: NAMESPACE, id: CLIENT_ID })

  window.setUpLog(client)

  client.setHandler(HANDSHAKE_REQUEST, async args => {
    client.log(
      `Received ${HANDSHAKE_REQUEST} with args: ${JSON.stringify(args)}`
    )
    const { version } = args
    client.log(`Responding with version: ${version}`)
    return version
  })

  client.setHandler(START_REQUEST, async args => {
    client.log(`Received ${START_REQUEST} with args: ${JSON.stringify(args)}`)
    client.log(`Responding with ${START_RESPONSE}`)
    return START_RESPONSE
  })

  client.log(`Connecting to server`)
  try {
    await client.init()
  } catch (err) {
    client.log(`Failed to connect to server: ${err}`)
    return
  }
  client.log(`Connected to server, sending ${PING_REQUEST}`)
  let response
  try {
    response = await client.send(PING_REQUEST, { demo: true })
  } catch (err) {
    client.log(`Failed to send ${PING_REQUEST} to server: ${err}`)
    return
  }
  client.log(
    `Server responded to ${PING_REQUEST} with ${JSON.stringify(response)}`
  )
})()
