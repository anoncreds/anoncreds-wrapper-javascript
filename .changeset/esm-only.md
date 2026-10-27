---
'@hyperledger/anoncreds-nodejs': minor
'@hyperledger/anoncreds-react-native': minor
'@hyperledger/anoncreds-shared': minor
---

feat: publish ESM only, instead of CommonJS. The packages are now built with tsdown and have an `exports` map. CommonJS code can still `require()` the packages on Node.js 22.12 and newer
