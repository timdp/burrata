import { setUpMasterWithSlaves } from './lib/helpers'

describe('Master', function () {
  let master

  beforeEach(async function () {
    [master] = await setUpMasterWithSlaves(3)
  })

  afterEach(function () {
    master.dispose()
  })

  describe('broadcast', function () {
    it('broadcasts to all slaves', async () => {
      const slaveIds = Object.keys(master.slaves)
      const expected = slaveIds.reduce(
        (acc, id) => Object.assign(acc, { [id]: id }),
        {})
      const actual = await master.broadcast('id')
      expect(actual).to.deep.equal(expected)
    })
  })
})
