import {
  setUpMasterWithSlave,
  setUpMasterWithSlaves,
  benchmark
} from './lib/helpers'

const BENCHMARK_DURATION = 3000
const NUM_SLAVES = 10

describe('Performance', function () {
  this.timeout(BENCHMARK_DURATION + 1000)

  describe('send', function () {
    let master, slave

    beforeEach(async function () {
      [master, slave] = await setUpMasterWithSlave()
      master.setHandler('noop', async () => null)
    })

    afterEach(function () {
      master.dispose()
    })

    it('benchmark', async () => {
      const perSec = await benchmark(async () => {
        await slave.send('noop')
      }, BENCHMARK_DURATION)
      console.info(`Sends per second with one slave: ${perSec.toFixed(2)}`)
    })
  })

  describe('broadcast', function () {
    let master

    beforeEach(async function () {
      [master] = await setUpMasterWithSlaves(NUM_SLAVES)
    })

    afterEach(function () {
      master.dispose()
    })

    it('benchmark', async () => {
      const perSec = await benchmark(async () => {
        await master.broadcast('noop')
      }, BENCHMARK_DURATION)
      console.info(`Broadcasts per second with ${NUM_SLAVES} slaves: ${perSec.toFixed(2)}`)
    })
  })
})
