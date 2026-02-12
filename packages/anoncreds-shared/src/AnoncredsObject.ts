import { ObjectHandle } from './ObjectHandle'
import { NativeAnoncreds } from './register'
import type { JsonObject } from './types'

export class AnoncredsObject {
  public handle: ObjectHandle

  public constructor(handle: number) {
    this.handle = new ObjectHandle(handle)
  }

  public toJson() {
    return JSON.parse(NativeAnoncreds.instance.getJson({ objectHandle: this.handle })) as JsonObject
  }
}
