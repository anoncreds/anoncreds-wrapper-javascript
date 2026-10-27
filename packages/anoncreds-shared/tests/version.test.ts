import { NativeAnoncreds } from '@hyperledger/anoncreds-shared'
import { describe, expect, test } from 'vitest'

describe('version', () => {
  test('returns the version of the native library', () => {
    expect(NativeAnoncreds.instance.version()).toMatch(/^\d+\.\d+\.\d+/)
  })
})
