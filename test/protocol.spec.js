import { setUpMasterWithSlave } from './helpers'

describe('Protocol', function () {
  let ctx

  beforeEach(async function () {
    ctx = await setUpMasterWithSlave()
  })

  afterEach(() => ctx.dispose())

  it('handles nonexistent commands', async function () {
    const { slave } = ctx
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
