import { setUpMasterWithSlave } from './lib/helpers'

describe('Protocol', function () {
  let slave

  beforeEach(async function () {
    [, slave] = await setUpMasterWithSlave()
  })

  it('handles nonexistent commands', async function () {
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
