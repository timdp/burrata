import {
  setUpMasterWithSlave,
  setUpMasterWithSlaves,
  benchmark
} from './helpers'

const BENCHMARK_DURATION = 5000
const NUM_SLAVES = 10

describe('Benchmarks', function () {
  this.timeout(BENCHMARK_DURATION + 1000)

  let master, slave

  afterEach(function () {
    master.dispose()
    master = null
    slave = null
  })

  it('send', async () => {
    [master, slave] = await setUpMasterWithSlave()
    master.setHandler('noop', async () => null)
    console.info(`Benchmarking send for ${BENCHMARK_DURATION} ms`)
    const perSec = await benchmark(async () => {
      await slave.send('noop')
    }, BENCHMARK_DURATION)
    console.info(`Sends per second with one slave: ${perSec.toFixed(2)}`)
  })

  it('broadcast', async () => {
    [master] = await setUpMasterWithSlaves(NUM_SLAVES)
    console.info(`Benchmarking broadcast for ${BENCHMARK_DURATION} ms`)
    const perSec = await benchmark(async () => {
      await master.broadcast('noop')
    }, BENCHMARK_DURATION)
    console.info(`Broadcasts per second with ${NUM_SLAVES} slaves: ${perSec.toFixed(2)}`)
  })
})
