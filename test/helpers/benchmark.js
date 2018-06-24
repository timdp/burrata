const TIMINGS_DEFAULT_SIZE = 100000

export const benchmark = async (doOnce, duration) => {
  let count = 0
  let endTime
  const startTimes = new Array(TIMINGS_DEFAULT_SIZE)
  const endTimes = new Array(TIMINGS_DEFAULT_SIZE)
  const startTime = performance.now()
  const maxTime = startTime + duration
  do {
    startTimes[count] = performance.now()
    await doOnce()
    endTimes[count] = endTime = performance.now()
    ++count
  } while (endTime < maxTime)
  const elapsedMs = endTime - startTime
  const perSec = 1000 * count / elapsedMs
  const timings = endTimes
    .slice(0, count)
    .map((endTime, i) => endTime - startTimes[i])
  return [perSec, timings]
}
