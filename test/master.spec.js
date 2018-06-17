import { setUpMasterWithSlaves } from './lib/helpers'

describe('Master', function () {
  let master

  beforeEach(async function () {
    [master] = await setUpMasterWithSlaves(3)
  })

  describe('broadcast', function () {
    it('broadcasts to all slaves', async () => {
      const responses = await master.broadcast('id')
      expect(responses).to.deep.equal({
        '1': '1',
        '2': '2',
        '3': '3'
      })
    })
  })
})
