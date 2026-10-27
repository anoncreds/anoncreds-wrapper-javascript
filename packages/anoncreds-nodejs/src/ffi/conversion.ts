import type { ObjectHandle } from '@hyperledger/anoncreds-shared'
import koffi from 'koffi'

export const stringListToStringListStruct = (stringList: Array<string>) => {
  return {
    count: stringList.length,
    data: stringList,
  }
}

// Reads a UTF-8 byte buffer that AnonCreds allocated as a string. koffi.decode(data, type, len) would make a new array
// type on every call, which koffi never frees
export const byteBufferToString = (byteBuffer: { data: unknown; len: number }): string =>
  koffi.decode.string(byteBuffer.data, byteBuffer.len)

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
