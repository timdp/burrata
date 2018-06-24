import delay from 'delay'
import numeral from 'numeral'
import stats from 'stats-lite'
import {
  setUpServerWithClient,
  setUpServerWithClients,
  benchmark
} from './helpers'

const BENCHMARK_DURATION = 5000
const SLEEP_TIME = 3000
const CLIENT_COUNTS = [2, 4, 8, 16, 32, 64, 128, 256]

const formatNumber = n => numeral(n).format('0,0.00')

const formatTime = n => formatNumber(n) + ' ms'

const formatThroughput = n => formatNumber(n) + ' sends/sec'

const percentile = p => n => stats.percentile(n, p / 100)

const statTypes = {
  mean: stats.mean,
  stdev: stats.stdev,
  min: a => Math.min(...a),
  p50: percentile(50),
  p90: percentile(90),
  p95: percentile(95),
  p99: percentile(99),
  max: a => Math.max(...a)
}

const printLatencyStats = latencies => {
  console.info('Latency statistics:')
  for (const [n, fn] of Object.entries(statTypes)) {
    console.info(`  ${n}: ${formatTime(fn(latencies))}`)
  }
}

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
      console.info(`Benchmarking send for ${formatTime(BENCHMARK_DURATION)}`)
      const [throughput, latencies] = await benchmark(async () => {
        await client.send('noop')
      }, BENCHMARK_DURATION)
      console.info(`Send throughput: ${formatThroughput(throughput)}`)
      printLatencyStats(latencies)
    })
  })

  describe('broadcast', function () {
    this.timeout(BENCHMARK_DURATION + 5000)

    for (const count of CLIENT_COUNTS) {
      it(`${count} clients`, async function () {
        ctx = await setUpServerWithClients(count)
        const { server } = ctx
        console.info(
          `Benchmarking broadcast with ${count} clients for ${formatTime(
            BENCHMARK_DURATION
          )}`
        )
        const [perSec, latencies] = await benchmark(async () => {
          await server.broadcast('noop')
        }, BENCHMARK_DURATION)
        const throughput = perSec * count
        console.info(
          `Broadcast throughput with ${count} clients: ${formatThroughput(
            throughput
          )}`
        )
        printLatencyStats(latencies)
      })
    }
  })
})
