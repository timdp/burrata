import { setUpServerWithClients } from './helpers'

describe('Server', function () {
  let ctx

  beforeEach(async function () {
    ctx = await setUpServerWithClients(3)
  })

  afterEach(function () {
    ctx.dispose()
  })

  describe('broadcast', function () {
    it('broadcasts to all clients', async () => {
      const { server } = ctx
      const clientIds = Object.keys(server.clients)
      const expected = clientIds.reduce(
        (acc, id) => Object.assign(acc, { [id]: id }),
        {}
      )
      const actual = await server.broadcast('id')
      expect(actual).to.deep.equal(expected)
    })
  })
})
