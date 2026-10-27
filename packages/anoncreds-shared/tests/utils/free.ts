import { ObjectHandle } from '@hyperledger/anoncreds-shared'

/**
 * Frees native objects: object handles, or objects that hold one, like the classes of the API
 */
export const free = (...objects: Array<ObjectHandle | { handle: ObjectHandle }>) => {
  for (const object of objects) {
    if (object instanceof ObjectHandle) object.clear()
    else object.handle.clear()
  }
}
