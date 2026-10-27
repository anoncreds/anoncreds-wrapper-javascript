import { afterEach, expect } from 'vitest'
import { trackNativeResources } from './utils/resources'

// Every test frees the native objects it creates, and so does the library. Runs after the tests' own afterEach
const resources = trackNativeResources()

afterEach(() => {
  expect(resources.takeOpen()).toEqual([])
})
