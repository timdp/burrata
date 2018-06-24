import { setUpServerWithClient } from './helpers'

describe('Protocol', function () {
  const ctxs = []

  const addContext = async () => {
    const ctx = await setUpServerWithClient()
    ctxs.push(ctx)
    return ctx
  }

  beforeEach(addContext)

  afterEach(function () {
    const toDispose = ctxs.splice(0)
    for (const ctx of toDispose) {
      ctx.dispose()
    }
  })

  it('supports multiple servers', async function () {
    await addContext()
    const [{ server: server1 }, { server: server2 }] = ctxs
    const numClients1 = Object.keys(server1.clients).length
    const numClients2 = Object.keys(server2.clients).length
    expect([numClients1, numClients2]).to.deep.equal([1, 1])
  })

  it('filters by namespace', async function () {
    await addContext()
    const [
      { server: server1, client: client1 },
      { server: server2, client: client2 }
    ] = ctxs
    let calls1 = 0
    server1.setHandler('cmd', async () => {
      ++calls1
    })
    let calls2 = 0
    server2.setHandler('cmd', async () => {
      ++calls2
    })
    await client1.send('trigger', { type: 'cmd' })
    expect([calls1, calls2]).to.deep.equal([1, 0])
    await client2.send('trigger', { type: 'cmd' })
    expect([calls1, calls2]).to.deep.equal([1, 1])
  })

  it('handles nonexistent commands', async function () {
    const { client } = ctxs[0]
    let error = null
    try {
      await client.send('doesNotExist')
    } catch (err) {
      error = err
    }
    expect(error).to.be.ok()
    expect(error.message).to.equal('Unknown command: doesNotExist')
  })
})
