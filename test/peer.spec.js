import { Peer } from '../src'

describe('Peer', function () {
  const ns = 'peertest'

  let peer1, peer2

  beforeEach(async function () {
    peer1 = new Peer({ ns })
    peer2 = new Peer({ ns })
    await Promise.all([peer1.init(), peer2.init()])
  })

  afterEach(function () {
    peer2.dispose()
    peer1.dispose()
  })

  it('ping-pongs', async function () {
    peer1.setHandler('ping', async () => 'pong')
    const resp = await peer2.send('ping')
    expect(resp).to.equal('pong')
  })
})
