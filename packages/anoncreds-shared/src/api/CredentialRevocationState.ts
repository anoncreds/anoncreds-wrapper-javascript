import type { ObjectHandle } from '../ObjectHandle'
import type { JsonObject } from '../types'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

import { RevocationRegistryDefinition } from './RevocationRegistryDefinition'
import { RevocationStatusList } from './RevocationStatusList'
import { pushToArray } from './utils'

export type CreateRevocationStateOptions = {
  revocationRegistryDefinition: RevocationRegistryDefinition
  revocationStatusList: RevocationStatusList
  revocationRegistryIndex: number
  tailsPath: string
  oldRevocationStatusList?: RevocationStatusList
  oldRevocationState?: CredentialRevocationState
}

export type UpdateRevocationStateOptions = Required<
  Pick<CreateRevocationStateOptions, 'oldRevocationStatusList' | 'oldRevocationState'>
> &
  Omit<CreateRevocationStateOptions, 'oldRevocationStatusList' | 'oldRevocationState'>

export class CredentialRevocationState extends AnoncredsObject {
  public static create(options: CreateRevocationStateOptions) {
    let credentialRevocationStateHandle: ObjectHandle
    // Objects created within this method must be freed up
    const objectHandles: ObjectHandle[] = []
    try {
      const revocationRegistryDefinition =
        options.revocationRegistryDefinition instanceof RevocationRegistryDefinition
          ? options.revocationRegistryDefinition.handle
          : pushToArray(
              RevocationRegistryDefinition.fromJson(options.revocationRegistryDefinition).handle,
              objectHandles
            )

      const revocationStatusList =
        options.revocationStatusList instanceof RevocationStatusList
          ? options.revocationStatusList.handle
          : pushToArray(RevocationStatusList.fromJson(options.revocationStatusList).handle, objectHandles)

      credentialRevocationStateHandle = NativeAnoncreds.instance.createOrUpdateRevocationState({
        revocationRegistryDefinition,
        revocationStatusList,
        revocationRegistryIndex: options.revocationRegistryIndex,
        tailsPath: options.tailsPath,
        oldRevocationStatusList: undefined,
        oldRevocationState: undefined,
      })
    } finally {
      for (const handle of objectHandles) {
        handle.clear()
      }
    }
    return new CredentialRevocationState(credentialRevocationStateHandle.handle)
  }

  public static fromJson(json: JsonObject) {
    return new CredentialRevocationState(
      NativeAnoncreds.instance.revocationStateFromJson({ json: JSON.stringify(json) }).handle
    )
  }

  public update(options: UpdateRevocationStateOptions) {
    this.handle = NativeAnoncreds.instance.createOrUpdateRevocationState({
      revocationRegistryDefinition: options.revocationRegistryDefinition.handle,
      revocationStatusList: options.revocationStatusList.handle,
      revocationRegistryIndex: options.revocationRegistryIndex,
      tailsPath: options.tailsPath,
      oldRevocationStatusList: options.oldRevocationStatusList.handle,
      oldRevocationState: options.oldRevocationState.handle,
    })
  }
}
