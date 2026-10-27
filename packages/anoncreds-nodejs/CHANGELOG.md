# @hyperledger/anoncreds-nodejs

## 0.5.0

### Minor Changes

- 9c293e8: feat: publish ESM only, instead of CommonJS. The packages are now built with tsdown and have an `exports` map. CommonJS code can still `require()` the packages on Node.js 22.12 and newer, which `@hyperledger/anoncreds-nodejs` now requires.
- a8db468: feat(nodejs): require Node.js 22 or newer and update koffi to v3. Node.js 20 is end of life. koffi 3 installs its native binary from a package for your platform (`@koromix/koffi-<platform>`) instead of shipping the binaries for all platforms.

### Patch Changes

- c6123a4: fix: free native memory that leaked. Node.js and React Native now free the strings that AnonCreds returns, and React Native frees the lists and JSON it passes to AnonCreds. `RevocationStatusList.update`, `RevocationStatusList.updateTimestamp` and `CredentialRevocationState.update` free the native object they replace, and the `W3cCredential` getters free the proof details they read. On Node.js, `toJson` no longer leaks memory on every call, and `anoncredsNodeJS.version()` now returns the version instead of a pointer
- Updated dependencies [9c293e8]
- Updated dependencies [c6123a4]
- Updated dependencies [c6123a4]
  - @hyperledger/anoncreds-shared@0.5.0

## 0.4.1

### Patch Changes

- @hyperledger/anoncreds-shared@0.4.1

## 0.4.0

### Minor Changes

- 6694695: - Updated nodejs wrapper to support koffi
  - Include nodejs 24 support
  - Drop nodejs 18 support
  - Added `Nonce` class to generate a nonce
  - Now relying on vitest

### Patch Changes

- Updated dependencies [6694695]
  - @hyperledger/anoncreds-shared@0.4.0

## 0.3.4

### Patch Changes

- aa9f0d2: update to use anoncreds-rs v0.2.3
  - @hyperledger/anoncreds-shared@0.3.4

## 0.3.3

### Patch Changes

- @hyperledger/anoncreds-shared@0.3.3

## 0.3.2

### Patch Changes

- 350ec17: chore: update to anoncreds-rs version 0.2.2. This release adds support for 16KB page sizes on Android.
  - @hyperledger/anoncreds-shared@0.3.2

## 0.3.1

### Patch Changes

- f55d86f: New release under new repository
- Updated dependencies [f55d86f]
  - @hyperledger/anoncreds-shared@0.3.1
