import { setUpMasterWithSlave } from './helpers'

describe('Protocol', function () {
  let master, slave

  beforeEach(async function () {
    [master, slave] = await setUpMasterWithSlave()
  })

  afterEach(function () {
    master.dispose()
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
