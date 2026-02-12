import type { ObjectHandle } from '@hyperledger/anoncreds-shared'
import koffi from 'koffi'
import { FFI_UINT8 } from './primitives'

export const stringListToStringListStruct = (stringList: Array<string>) => {
  return {
    count: stringList.length,
    data: stringList,
  }
}

export const byteBufferToUint8Array = (byteBuffer: { data: Uint8Array; len: number }): Uint8Array => {
  const { data, len } = byteBuffer

  if (data instanceof Uint8Array) {
    return data.slice(0, len)
  }

  const decoded: Uint8Array = koffi.decode(data, FFI_UINT8, len)
  return decoded
}

export const objectHandleListToObjectHandleListStruct = (objectHandleList: Array<ObjectHandle>) => {
  return {
    count: objectHandleList.length,
    data: objectHandleList.map((h) => h.handle),
  }
}

export const i32ListToI32ListStruct = (i32List: Array<number>) => {
  return {
    count: i32List.length,
    data: i32List,
  }
}
