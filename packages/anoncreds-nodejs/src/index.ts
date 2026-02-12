import { NativeAnoncreds } from '@hyperledger/anoncreds-shared'
import { NodeJSAnoncreds } from './NodeJSAnoncreds'

export const anoncredsNodeJS = new NodeJSAnoncreds()
NativeAnoncreds.register(anoncredsNodeJS)

export * from '@hyperledger/anoncreds-shared'
