import type { Anoncreds } from './Anoncreds'
import { AnoncredsError } from './error'

/**
 * @deprecated use `NativeAnoncreds`.instance` instead
 */
export let anoncreds: Anoncreds

export class NativeAnoncreds {
  static #nativeAnoncreds: Anoncreds

  public static get instance(): Anoncreds {
    if (!NativeAnoncreds.#nativeAnoncreds)
      throw AnoncredsError.customError({
        message:
          "Native anoncreds has not been registered yet. Make sure to import '@hyperledger/anoncreds-nodejs' or '@hyperledger/anoncreds-react-native', or call 'NativeAnoncreds.register' with a custom implementation.",
      })

    return NativeAnoncreds.#nativeAnoncreds
  }

  public static register(nativeAnoncreds: Anoncreds) {
    anoncreds = nativeAnoncreds
    NativeAnoncreds.#nativeAnoncreds = nativeAnoncreds
  }
}

/**
 * @deprecated use `NativeAnoncreds.register` instead
 */
export const registerAnoncreds = ({ lib }: { lib: Anoncreds }) => {
  anoncreds = lib
  NativeAnoncreds.register(lib)
}
