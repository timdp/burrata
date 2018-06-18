import delay from 'delay'
import numeral from 'numeral'
import {
  setUpMasterWithSlave,
  setUpMasterWithSlaves,
  benchmark
} from './helpers'

const BENCHMARK_DURATION = 5000
const SLEEP_TIME = 3000
const SLAVE_COUNTS = [2, 4, 8, 16, 32, 64, 128, 256]

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
      ctx = await setUpMasterWithSlave()
      const { master, slave } = ctx
      master.setHandler('noop', async () => null)
      console.info(`Benchmarking send for ${BENCHMARK_DURATION} ms`)
      const perSec = await benchmark(async () => {
        await slave.send('noop')
      }, BENCHMARK_DURATION)
      console.info('Send throughput: ' + format(perSec))
    })
  })

  describe('broadcast', function () {
    this.timeout(BENCHMARK_DURATION + 5000)

    for (const count of SLAVE_COUNTS) {
      it(`${count} slaves`, async function () {
        ctx = await setUpMasterWithSlaves(count)
        const { master } = ctx
        console.info(
          `Benchmarking broadcast with ${count} slaves for ${BENCHMARK_DURATION} ms`
        )
        const perSec = await benchmark(async () => {
          await master.broadcast('noop')
        }, BENCHMARK_DURATION)
        const throughput = perSec * count
        console.info(
          `Broadcast throughput with ${count} slaves: ` + format(throughput)
        )
      })
    }
  })
})
