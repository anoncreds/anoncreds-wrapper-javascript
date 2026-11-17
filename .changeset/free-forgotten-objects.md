---
'@hyperledger/anoncreds-nodejs': patch
'@hyperledger/anoncreds-shared': minor
---

fix(nodejs): free AnonCreds objects that are garbage collected without being freed. Keep calling `handle.clear()`: this is a safety net that runs whenever the garbage collector does. Keep the `ObjectHandle` that AnonCreds returned for as long as you use the object, as the API classes do: the object is freed once that handle is collected. `toJson` frees its buffer also when reading it fails.

BREAKING: the constructor of the API classes takes the `ObjectHandle` instead of its number. Pass `new Schema(handle)` instead of `new Schema(handle.handle)`.
