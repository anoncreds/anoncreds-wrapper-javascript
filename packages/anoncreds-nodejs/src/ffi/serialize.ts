import { ObjectHandle } from '@hyperledger/anoncreds-shared'
import { I32ListStruct, ObjectHandleListStruct, StringListStruct } from './structures'

type Argument = Record<string, unknown> | unknown[] | Date | Uint8Array | SerializedArgument | boolean | ObjectHandle

type SerializedArgument = string | number | ArrayBuffer | Buffer | object | null

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
              ? object
              : Type[Property] extends string[] | undefined
                ? object
                : Type[Property] extends number[]
                  ? object
                  : Type[Property] extends number[] | undefined
                    ? object
                    : Type[Property] extends Date
                      ? number
                      : Type[Property] extends Date | undefined
                        ? number
                        : Type[Property] extends string | undefined
                          ? string
                          : Type[Property] extends number | undefined
                            ? number
                            : Type[Property] extends Buffer
                              ? Buffer
                              : Type[Property] extends ObjectHandle
                                ? number
                                : Type[Property] extends ObjectHandle[]
                                  ? object
                                  : Type[Property] extends ObjectHandle[] | undefined
                                    ? object
                                    : Type[Property] extends ObjectHandle | undefined
                                      ? number
                                      : Type[Property] extends Uint8Array
                                        ? object
                                        : Type[Property] extends Uint8Array | undefined
                                          ? object
                                          : Type[Property] extends unknown[] | undefined
                                            ? string
                                            : Type[Property] extends Record<string, unknown> | undefined
                                              ? string
                                              : unknown
}>

// Serialize arguments for koffi
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
      if (arg === null) {
        return null
      }
      if (arg instanceof ObjectHandle) {
        return arg.handle
      }
      if (Array.isArray(arg)) {
        if (arg.every((it) => typeof it === 'string')) {
          // For koffi, create a simple object structure
          return {
            count: arg.length,
            data: arg,
          }
        }
        if (arg.every((it) => it instanceof ObjectHandle)) {
          return {
            count: arg.length,
            data: (arg as ObjectHandle[]).map((i: ObjectHandle) => i.handle),
          }
        }
        if (arg.every((it) => typeof it === 'number')) {
          return {
            count: arg.length,
            data: arg,
          }
        }
      }
      if (arg instanceof Date) {
        return arg.getTime()
      }
      if (arg instanceof Uint8Array) {
        return {
          len: arg.length,
          data: Buffer.from(arg),
        }
      }
      // For objects, JSON stringify
      return JSON.stringify(arg)
    default:
      throw new Error('could not serialize value')
  }
}

const serializeArguments = <T extends Record<string, Argument> = Record<string, Argument>>(
  args: T
): SerializedOptions<T> => {
  const retVal: SerializedArguments = {}
  for (const [key, val] of Object.entries(args)) {
    retVal[key] = serialize(val)
  }
  return retVal as SerializedOptions<T>
}

export { serializeArguments }
