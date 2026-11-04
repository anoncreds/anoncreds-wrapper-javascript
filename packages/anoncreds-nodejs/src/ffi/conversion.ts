import type { ObjectHandle } from '@hyperledger/anoncreds-shared'
import koffi from 'koffi'

export const stringListToStringListStruct = (stringList: Array<string>) => {
  return {
    count: stringList.length,
    data: stringList,
  }
}

export const byteBufferToString = (byteBuffer: { data: unknown; len: number }): string =>
  koffi.decode(byteBuffer.data, 'char', byteBuffer.len)

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
