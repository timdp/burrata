import { setUpMasterWithSlaves } from './helpers'

describe('Master', function () {
  let ctx

  beforeEach(async function () {
    ctx = await setUpMasterWithSlaves(3)
  })

  afterEach(function () {
    ctx.dispose()
  })

  describe('broadcast', function () {
    it('broadcasts to all slaves', async () => {
      const { master } = ctx
      const slaveIds = Object.keys(master.slaves)
      const expected = slaveIds.reduce(
        (acc, id) => Object.assign(acc, { [id]: id }),
        {}
      )
      const actual = await master.broadcast('id')
      expect(actual).to.deep.equal(expected)
    })
  })
})
