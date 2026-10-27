import { afterEach, expect } from 'vitest'
import { trackNativeResources } from './utils/resources'

// Every test frees the native objects it creates, and so does the library. Runs after the tests' own afterEach
const resources = trackNativeResources()

afterEach((context) => {
  const open = resources.takeOpen()

  // A test that already failed may not have reached its frees, so checking would only report a second failure. Vitest
  // passes the test to the hook, React Native Harness doesn't
  if (context?.task?.result?.state === 'fail') return
  expect(open).toEqual([])
})
