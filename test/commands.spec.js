import { setUpMasterWithSlave } from './lib/helpers'

describe('Commands', function () {
  let slave

  beforeEach(async function () {
    [, slave] = await setUpMasterWithSlave()
  })

  // Command without args
  describe('noop', function () {
    it('returns null', async function () {
      const res = await slave.send('noop')
      expect(res).to.equal(null)
    })
  })

  // Command with scalar args and scalar return value
  describe('sum', function () {
    it('returns the sum of a and b', async function () {
      const a = 14.7
      const b = 9.5
      const expected = a + b
      const actual = await slave.send('sum', { a, b })
      expect(actual).to.equal(expected)
    })
  })

  // Command with array args and array return value
  describe('uppercase', function () {
    it('returns uppercased strings', async function () {
      const strings = ['foo', 'bar']
      const actual = await slave.send('uppercase', { strings })
      const expected = ['FOO', 'BAR']
      expect(actual).to.deep.equal(expected)
    })
  })

  // Command that throws
  describe('fail', function () {
    it('rejects with CustomError', async function () {
      let error = null
      try {
        await slave.send('fail')
      } catch (err) {
        error = err
      }
      expect(error).to.be.ok()
      expect(error.name).to.equal('CustomError')
      expect(error.message).to.equal('It failed')
    })
  })
})
