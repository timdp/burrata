import delay from 'delay'
import numeral from 'numeral'
import {
  setUpServerWithClient,
  setUpServerWithClients,
  benchmark
} from './helpers'

const BENCHMARK_DURATION = 5000
const SLEEP_TIME = 3000
const CLIENT_COUNTS = [2, 4, 8, 16, 32, 64, 128, 256]

const format = n => numeral(n).format('0,0.00') + ' sends/sec'

describe('Benchmarks', function () {
  let ctx

  beforeEach(async function () {
    this.timeout(SLEEP_TIME + 5000)
    await delay(SLEEP_TIME)
  })

  afterEach(function () {
    ctx.dispose()
  })

  describe('send', function () {
    this.timeout(BENCHMARK_DURATION + 1000)

    it('send', async function () {
      ctx = await setUpServerWithClient()
      const { server, client } = ctx
      server.setHandler('noop', async () => null)
      console.info(`Benchmarking send for ${BENCHMARK_DURATION} ms`)
      const perSec = await benchmark(async () => {
        await client.send('noop')
      }, BENCHMARK_DURATION)
      console.info('Send throughput: ' + format(perSec))
    })
  })

  describe('broadcast', function () {
    this.timeout(BENCHMARK_DURATION + 5000)

    for (const count of CLIENT_COUNTS) {
      it(`${count} clients`, async function () {
        ctx = await setUpServerWithClients(count)
        const { server } = ctx
        console.info(
          `Benchmarking broadcast with ${count} clients for ${BENCHMARK_DURATION} ms`
        )
        const perSec = await benchmark(async () => {
          await server.broadcast('noop')
        }, BENCHMARK_DURATION)
        const throughput = perSec * count
        console.info(
          `Broadcast throughput with ${count} clients: ` + format(throughput)
        )
      })
    }
  })
})
