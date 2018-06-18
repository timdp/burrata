import ExtendableError from 'es6-error'
import { Slave } from '../../src'

  ;(async () => {
  const { ns, id } = JSON.parse(
    decodeURIComponent(window.location.hash.substr(1))
  )
  const slave = new Slave(ns, id)

  slave.setHandler('noop', async () => null)

  slave.setHandler('echo', async ({ message }) => message)

  slave.setHandler('id', async () => id)

  slave.setHandler('sum', async ({ a, b }) => a + b)

  slave.setHandler('uppercase', async ({ strings }) =>
    strings.map(str => str.toUpperCase())
  )

  slave.setHandler('trigger', async ({ type, args }) => {
    await slave.send(type, args)
  })

  class CustomError extends ExtendableError {}

  slave.setHandler('fail', async () => {
    throw new CustomError('It failed')
  })

  await slave.init()
})()
