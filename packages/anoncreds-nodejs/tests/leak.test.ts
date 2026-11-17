import { setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'
import { describe, expect, test } from 'vitest'
import { anoncredsNodeJS } from '../src/index.js'

setFlagsFromString('--expose-gc')
const collectGarbage = runInNewContext('gc') as () => void

const ROUNDS = 4

const rssAfterGarbageCollection = async () => {
  // Finalizers and koffi's deferred frees run on the event loop, after the collection
  for (let i = 0; i < 4; i++) {
    collectGarbage()
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  return process.memoryUsage().rss
}

/**
 * Bytes of RSS that each call of `iteration` leaves behind, after a warm-up. A leak grows in every round and the noise
 * of the allocator does not, so the round that grew least counts
 */
const rssGrowthPerIteration = async (iteration: () => void, iterations: number) => {
  const round = async () => {
    for (let i = 0; i < iterations; i++) iteration()
    return await rssAfterGarbageCollection()
  }

  let before = await round()
  let growth = Number.POSITIVE_INFINITY
  for (let i = 0; i < ROUNDS; i++) {
    const after = await round()
    growth = Math.min(growth, (after - before) / iterations)
    before = after
  }

  console.log(`${expect.getState().currentTestName}: rss ${growth.toFixed(0)} bytes per iteration`)
  return growth
}

describe('native memory', { timeout: 120_000 }, () => {
  test('frees objects that are garbage collected without being freed', async () => {
    // Not through NativeAnoncreds.instance: the tests check that every object created through it is freed
    const growth = await rssGrowthPerIteration(() => {
      for (let i = 0; i < 100; i++) {
        anoncredsNodeJS.createSchema({
          name: 'schema',
          version: '1.0',
          issuerId: 'mock:uri',
          attributeNames: ['name', 'age', 'address', 'email'],
        })
      }
    }, 100)

    expect(growth).toBeLessThan(2048)
  })
})
