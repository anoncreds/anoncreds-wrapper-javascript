import { NativeModules, Platform } from 'react-native'
import type { NativeBindings } from './NativeBindings'
import AnoncredsModule from './specs/NativeAnoncreds'

declare global {
  const _anoncreds: NativeBindings
}

export const register = (): NativeBindings => {
  const libraryName = 'anoncreds'

  let doesAnoncredsExist = false
  try {
    doesAnoncredsExist = Boolean(_anoncreds)
  } catch {
    doesAnoncredsExist = false
  }

  // Check if the constructor exists. If not, try installing the JSI bindings.
  if (!doesAnoncredsExist) {
    if (AnoncredsModule == null) {
      let message = `Failed to create a new ${libraryName}' instance: The native ${libraryName} Module could not be found.'
      message += '\n* Make sure is correctly autolinked.`

      if (Platform.OS === 'ios' || Platform.OS === 'macos') {
        message += '\n* Make sure you ran `pod install` in the ios/ directory.'
      }

      if (Platform.OS === 'android') {
        message += '\n* Make sure gradle is synced.'
      }

      // check if Expo

      const ExpoConstants = NativeModules.NativeUnimoduleProxy?.modulesConstants?.ExponentConstants
      if (ExpoConstants != null) {
        if (ExpoConstants.appOwnership === 'expo') {
          // We're running Expo Go
          throw new Error(
            `@hyperledger/${libraryName}-react-native is not supported in Expo Go! Use EAS ('expo prebuild') or eject to a bare workflow instead.`
          )
        }
        message += '\n* Make sure you ran `expo prebuild`.'
      }

      message += '\n* Make sure you rebuilt the app.'
      throw new Error(message)
    }

    // Only reached on the old architecture: on the New Architecture, getting the module already installed the bindings
    const result = AnoncredsModule.install()
    if (!result)
      throw new Error(
        `Failed to create a new ${libraryName} instance: The native ${libraryName} Module could not be installed! Looks like something went wrong when installing JSI bindings.`
      )

    // Check again if the constructor now exists. If not, throw an error.
    if (_anoncreds == null)
      throw new Error(
        `Failed to create a new ${libraryName} instance, the native initializer function does not exist. Are you trying to use ${libraryName} from different JS Runtimes?`
      )
  }

  return _anoncreds
}
