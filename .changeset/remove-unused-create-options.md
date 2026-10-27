---
'@hyperledger/anoncreds-shared': minor
---

feat!: remove the `revocationRegistryId` and `revocationStatusList` options of `Credential.create` and `W3cCredential.create`. They have had no effect since 0.2.0. Pass the revocation status list in `revocationConfiguration` instead.

Also remove `CredentialRevocationConfig.clear()`. It freed the revocation registry definition and its private part, but not the status list. The configuration only holds objects that you create, so free them yourself with `handle.clear()` when you no longer need them
