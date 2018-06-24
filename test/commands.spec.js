import defer from 'p-defer'
import { setUpServerWithClient } from './helpers'

describe('Commands', function () {
  let ctx

  beforeEach(async function () {
    ctx = await setUpServerWithClient()
  })

  afterEach(function () {
    ctx.dispose()
  })

  // Command without args
  describe('noop', function () {
    it('returns null', async function () {
      const { client } = ctx
      const res = await client.send('noop')
      expect(res).to.equal(null)
    })
  })

  // Command with scalar args and scalar return value
  describe('sum', function () {
    it('returns the sum of a and b', async function () {
      const { client } = ctx
      const a = 14.7
      const b = 9.5
      const expected = a + b
      const actual = await client.send('sum', { a, b })
      expect(actual).to.equal(expected)
    })
  })

  // Command with array args and array return value
  describe('uppercase', function () {
    it('returns uppercased strings', async function () {
      const { client } = ctx
      const strings = ['foo', 'bar']
      const actual = await client.send('uppercase', { strings })
      const expected = ['FOO', 'BAR']
      expect(actual).to.deep.equal(expected)
    })
  })

  // Command that triggers server command (ping-pong style)
  describe('trigger', function () {
    it('triggers a server command', async function () {
      const { server, client } = ctx
      const dfd = defer()
      const type = 'dummy'
      const args = { foo: 'bar' }
      server.setHandler(type, async actualArgs => {
        dfd.resolve(actualArgs)
      })
      await client.send('trigger', { type, args })
      const actualArgs = await dfd.promise
      expect(actualArgs).to.deep.equal(args)
    })
  })

  // Command that throws
  describe('fail', function () {
    it('rejects with CustomError', async function () {
      const { client } = ctx
      let error = null
      try {
        await client.send('fail')
      } catch (err) {
        error = err
      }
      expect(error).to.be.ok()
      expect(error.name).to.equal('CustomError')
      expect(error.message).to.equal('It failed')
    })
  })
})
