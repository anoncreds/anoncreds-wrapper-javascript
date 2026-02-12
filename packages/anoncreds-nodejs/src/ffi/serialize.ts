import { ObjectHandle } from '@hyperledger/anoncreds-shared'

import {
  i32ListToI32ListStruct,
  objectHandleListToObjectHandleListStruct,
  stringListToStringListStruct,
} from './conversion'
import { ByteBufferStruct, I32ListStruct, StringListStruct } from './structures'

type Argument = Record<string, unknown> | unknown[] | Date | Uint8Array | SerializedArgument | boolean | ObjectHandle

type SerializedArgument = string | number | Uint8Array | Record<string, unknown> | null

type SerializedArguments = Record<string, SerializedArgument>

export type SerializedOptions<Type> = Required<{
  [Property in keyof Type]: Type[Property] extends string
    ? string
    : Type[Property] extends number
      ? number
      : Type[Property] extends boolean
        ? number
        : Type[Property] extends boolean | undefined
          ? number
          : Type[Property] extends Record<string, unknown>
            ? string
            : Type[Property] extends string[]
              ? string[]
              : Type[Property] extends string[] | undefined
                ? string[]
                : Type[Property] extends number[]
                  ? number[]
                  : Type[Property] extends number[] | undefined
                    ? number[]
                    : Type[Property] extends Date
                      ? number
                      : Type[Property] extends Date | undefined
                        ? number
                        : Type[Property] extends string | undefined
                          ? string
                          : Type[Property] extends number | undefined
                            ? number
                            : Type[Property] extends Uint8Array
                              ? Uint8Array
                              : Type[Property] extends ObjectHandle
                                ? number
                                : Type[Property] extends ObjectHandle[]
                                  ? number[]
                                  : Type[Property] extends ObjectHandle[] | undefined
                                    ? number[]
                                    : Type[Property] extends ObjectHandle | undefined
                                      ? number
                                      : Type[Property] extends Uint8Array
                                        ? typeof ByteBufferStruct
                                        : Type[Property] extends Uint8Array | undefined
                                          ? typeof ByteBufferStruct
                                          : Type[Property] extends unknown[] | undefined
                                            ? string
                                            : Type[Property] extends Record<string, unknown> | undefined
                                              ? string
                                              : unknown
}>

const serialize = (arg: Argument): SerializedArgument => {
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

export const serializeArguments = <T extends Record<string, Argument> = Record<string, Argument>>(
  args: T
): SerializedOptions<T> => {
  const retVal: SerializedArguments = {}
  for (const [key, val] of Object.entries(args)) {
    retVal[key] = serialize(val)
  }
  return retVal as SerializedOptions<T>
}
