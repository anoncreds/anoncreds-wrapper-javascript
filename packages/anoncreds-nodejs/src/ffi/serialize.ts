import { ObjectHandle } from '@hyperledger/anoncreds-shared'
import {
  i32ListToI32ListStruct,
  objectHandleListToObjectHandleListStruct,
  stringListToStringListStruct,
} from './conversion'

const serialize = (arg: unknown): unknown => {
  switch (typeof arg) {
    case 'undefined':
      return null
    case 'boolean':
      return Number(arg)
    case 'string':
      return arg
    case 'number':
      return arg
    case 'function':
      return arg
    case 'object':
      if (arg instanceof ObjectHandle) {
        return arg.handle
      }
      if (Array.isArray(arg)) {
        if (arg.every((it) => typeof it === 'string')) {
          return stringListToStringListStruct(arg)
        }
        if (arg.every((it) => it instanceof ObjectHandle)) {
          return objectHandleListToObjectHandleListStruct(arg)
        }
        if (arg.every((it) => typeof it === 'number')) {
          return i32ListToI32ListStruct(arg)
        }
      }
      return JSON.stringify(arg)
    default:
      throw new Error('could not serialize value')
  }
}

export const serializeArguments = <T extends Record<string, unknown> = Record<string, unknown>>(args: T) => {
  const retVal: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(args)) {
    retVal[key] = serialize(val)
  }
  return retVal
}
