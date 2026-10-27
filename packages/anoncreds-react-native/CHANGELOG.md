# @hyperledger/anoncreds-react-native

## 0.5.0

### Minor Changes

- 9c293e8: feat: publish ESM only, instead of CommonJS. The packages are now built with tsdown and have an `exports` map. CommonJS code can still `require()` the packages on Node.js 22.12 and newer, which `@hyperledger/anoncreds-nodejs` now requires.
- a8db468: feat(react-native): support React Native 0.87 and require React Native >= 0.77

### Patch Changes

- a8db468: fix(react-native): revocation. Creating a revocation registry definition, issuing a credential with revocation, updating a revocation status list and creating a revocation status list with a timestamp now work as on Node.js
- c6123a4: fix: free native memory that leaked. Node.js and React Native now free the strings that AnonCreds returns, and React Native frees the lists and JSON it passes to AnonCreds. `RevocationStatusList.update`, `RevocationStatusList.updateTimestamp` and `CredentialRevocationState.update` free the native object they replace, and the `W3cCredential` getters free the proof details they read. On Node.js, `toJson` no longer leaks memory on every call, and `anoncredsNodeJS.version()` now returns the version instead of a pointer
- c6123a4: fix(react-native): lists with more than 255 entries, such as the issued or revoked indices of a revocation status list, no longer overflow a fixed-size buffer. Strings from AnonCreds that aren't ASCII, such as schema ids, are no longer garbled. The revocation registry definition ids of non-revoked interval overrides no longer point to freed memory
- Updated dependencies [9c293e8]
- Updated dependencies [c6123a4]
- Updated dependencies [c6123a4]
  - @hyperledger/anoncreds-shared@0.5.0

## 0.4.1

### Patch Changes

- 41be1ca: fix(react-native): install JSI bindings under NewArch (bridgeless)
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

- d81572f: fix(react-native): wrapper page alignment
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
