---
'@hyperledger/anoncreds-nodejs': patch
'@hyperledger/anoncreds-react-native': patch
'@hyperledger/anoncreds-shared': patch
---

fix: free native memory that leaked. Node.js and React Native now free the strings that AnonCreds returns, and React Native frees the lists and JSON it passes to AnonCreds. `RevocationStatusList.update`, `RevocationStatusList.updateTimestamp` and `CredentialRevocationState.update` free the native object they replace, and the `W3cCredential` getters free the proof details they read. On Node.js, `toJson` no longer leaks memory on every call, and `anoncredsNodeJS.version()` now returns the version instead of a pointer
