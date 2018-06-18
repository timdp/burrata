import { setUpMasterWithSlave } from './helpers'

describe('Protocol', function () {
  const ctxs = []

  const addContext = async () => {
    const ctx = await setUpMasterWithSlave()
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

  it('supports multiple masters', async function () {
    await addContext()
    const [{ master: master1 }, { master: master2 }] = ctxs
    const numSlaves1 = Object.keys(master1.slaves).length
    const numSlaves2 = Object.keys(master2.slaves).length
    expect([numSlaves1, numSlaves2]).to.deep.equal([1, 1])
  })

  it('filters by namespace', async function () {
    await addContext()
    const [
      { master: master1, slave: slave1 },
      { master: master2, slave: slave2 }
    ] = ctxs
    let calls1 = 0
    master1.setHandler('cmd', async () => {
      ++calls1
    })
    let calls2 = 0
    master2.setHandler('cmd', async () => {
      ++calls2
    })
    await slave1.send('trigger', { type: 'cmd' })
    expect([calls1, calls2]).to.deep.equal([1, 0])
    await slave2.send('trigger', { type: 'cmd' })
    expect([calls1, calls2]).to.deep.equal([1, 1])
  })

  it('handles nonexistent commands', async function () {
    const { slave } = ctxs[0]
    let error = null
    try {
      await slave.send('doesNotExist')
    } catch (err) {
      error = err
    }
    expect(error).to.be.ok()
    expect(error.message).to.equal('Unknown command: doesNotExist')
  })
})
