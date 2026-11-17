import { ObjectHandle } from './ObjectHandle'
import { NativeAnoncreds } from './register'
import type { JsonObject } from './types'

export class AnoncredsObject {
  public handle: ObjectHandle

  // Keeps the handle object that the native bindings returned: Node.js frees the object once that is garbage collected
  public constructor(handle: ObjectHandle | number) {
    this.handle = typeof handle === 'number' ? new ObjectHandle(handle) : handle
  }

  public toJson() {
    return JSON.parse(NativeAnoncreds.instance.getJson({ objectHandle: this.handle })) as JsonObject
  }
}
