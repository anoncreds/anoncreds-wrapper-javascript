# @hyperledger/anoncreds-shared

## 0.5.0

### Minor Changes

- 9c293e8: feat: publish ESM only, instead of CommonJS. The packages are now built with tsdown and have an `exports` map. CommonJS code can still `require()` the packages on Node.js 22.12 and newer, which `@hyperledger/anoncreds-nodejs` now requires.
- c6123a4: feat!: remove the `revocationRegistryId` and `revocationStatusList` options of `Credential.create` and `W3cCredential.create`. They have had no effect since 0.2.0. Pass the revocation status list in `revocationConfiguration` instead.
  
  Also remove `CredentialRevocationConfig.clear()`. It freed the revocation registry definition and its private part, but not the status list. The configuration only holds objects that you create, so free them yourself with `handle.clear()` when you no longer need them

### Patch Changes

- c6123a4: fix: free native memory that leaked. Node.js and React Native now free the strings that AnonCreds returns, and React Native frees the lists and JSON it passes to AnonCreds. `RevocationStatusList.update`, `RevocationStatusList.updateTimestamp` and `CredentialRevocationState.update` free the native object they replace, and the `W3cCredential` getters free the proof details they read. On Node.js, `toJson` no longer leaks memory on every call, and `anoncredsNodeJS.version()` now returns the version instead of a pointer

## 0.4.1

## 0.4.0

### Minor Changes

- 6694695: - Updated nodejs wrapper to support koffi
  - Include nodejs 24 support
  - Drop nodejs 18 support
  - Added `Nonce` class to generate a nonce
  - Now relying on vitest

## 0.3.4

## 0.3.3

## 0.3.2

## 0.3.1

### Patch Changes

- f55d86f: New release under new repository
