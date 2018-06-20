;(async () => {
  const { Peer } = window.burrata
  const { delay } = window

  const NAMESPACE = 'demo'
  const SLAVE_ID = window.location.hash.substr(1) || '1'

  // Number of seconds to wait for the other iframe to load
  const DELAY = 2

  // Protocol
  const PING_REQUEST = 'ping'
  const PONG_RESPONSE = 'pong'

  const { document: doc } = window.parent
  const windows = ['p1', 'p2'].map(id => doc.getElementById(id).contentWindow)
  const [source, target] = SLAVE_ID === '2' ? windows.reverse() : windows

  const peer = new Peer({ ns: NAMESPACE, id: SLAVE_ID, source, target })

  window.setUpLog(peer)

  peer.setHandler(PING_REQUEST, async args => {
    peer.log(`Received ${PING_REQUEST}`)
    peer.log(`Responding with ${PONG_RESPONSE}`)
    return PONG_RESPONSE
  })

  peer.log(`Starting to listen for peer connection`)
  peer.listen()
  peer.log(`Giving peer ${DELAY} second(s) to initialize`)
  await delay(DELAY * 1000)
  peer.log(`Connecting to peer`)
  try {
    await peer.connect()
  } catch (err) {
    peer.log(`Failed to connect to peer: ${err}`)
    return
  }
  peer.log(`Connected to peer, sending ${PING_REQUEST}`)
  let response
  try {
    response = await peer.send(PING_REQUEST)
  } catch (err) {
    peer.log(`Failed to send ${PING_REQUEST} to peer: ${err}`)
    return
  }
  peer.log(`Peer responded to ${PING_REQUEST} with ${JSON.stringify(response)}`)
})()
