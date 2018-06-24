import ExtendableError from 'es6-error'
import { Client } from '../../src'

const runClient = async () => {
  const { ns, id } = JSON.parse(
    decodeURIComponent(window.location.hash.substr(1))
  )
  const client = new Client({ ns, id })

  client.setHandler('noop', async () => null)

  client.setHandler('echo', async ({ message }) => message)

  client.setHandler('id', async () => id)

  client.setHandler('sum', async ({ a, b }) => a + b)

  client.setHandler('uppercase', async ({ strings }) =>
    strings.map(str => str.toUpperCase())
  )

  client.setHandler('trigger', async ({ type, args }) => {
    await client.send(type, args)
  })

  class CustomError extends ExtendableError {}

  client.setHandler('fail', async () => {
    throw new CustomError('It failed')
  })

  await client.init()
}

runClient().catch(err => {
  console.error(err)
})
