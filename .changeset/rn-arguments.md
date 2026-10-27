---
'@hyperledger/anoncreds-react-native': patch
---

fix(react-native): lists with more than 255 entries, such as the issued or revoked indices of a revocation status list, no longer overflow a fixed-size buffer. Strings from AnonCreds that aren't ASCII, such as schema ids, are no longer garbled. The revocation registry definition ids of non-revoked interval overrides no longer point to freed memory
