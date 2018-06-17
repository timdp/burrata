export const benchmark = async (doOnce, duration) => {
  let count = 0
  let endTime
  const startTime = performance.now()
  const maxTime = startTime + duration
  do {
    await doOnce()
    endTime = performance.now()
    ++count
  } while (endTime < maxTime)
  const elapsedMs = endTime - startTime
  const perSec = 1000 * count / elapsedMs
  return perSec
}
