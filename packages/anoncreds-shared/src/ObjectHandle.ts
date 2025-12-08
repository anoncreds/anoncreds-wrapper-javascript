import { NativeAnoncreds } from './register'

export class ObjectHandle {
  private readonly _handle: number

  public constructor(handle: number) {
    this._handle = handle
  }

  public get handle() {
    return this._handle
  }

  public typeName() {
    return NativeAnoncreds.instance.getTypeName({ objectHandle: this })
  }

  // TODO: do we need this?
  public clear() {
    NativeAnoncreds.instance.objectFree({ objectHandle: this })
  }
}
