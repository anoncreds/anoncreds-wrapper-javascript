import { NativeAnoncreds } from '@hyperledger/anoncreds-shared'

import { ReactNativeAnoncreds } from './ReactNativeAnoncreds'
import { register } from './register'

export * from '@hyperledger/anoncreds-shared'

NativeAnoncreds.register(new ReactNativeAnoncreds(register()))
