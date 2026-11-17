---
'@hyperledger/anoncreds-nodejs': patch
'@hyperledger/anoncreds-shared': patch
---

fix(nodejs): free AnonCreds objects that are garbage collected without being freed. Keep calling `handle.clear()`: this is a safety net that runs whenever the garbage collector does. Keep the `ObjectHandle` that AnonCreds returned for as long as you use the object, as the API classes do: the object is freed once that handle is collected. The constructor of the API classes now also takes an `ObjectHandle`. `toJson` frees its buffer also when reading it fails
