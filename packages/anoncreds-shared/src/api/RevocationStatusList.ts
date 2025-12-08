import type { ObjectHandle } from '../ObjectHandle'
import type { JsonObject } from '../types'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

import { CredentialDefinition } from './CredentialDefinition'
import { RevocationRegistryDefinition } from './RevocationRegistryDefinition'
import { RevocationRegistryDefinitionPrivate } from './RevocationRegistryDefinitionPrivate'
import { pushToArray } from './utils'

export type CreateRevocationStatusListOptions = {
  credentialDefinition: CredentialDefinition | JsonObject
  revocationRegistryDefinitionId: string
  revocationRegistryDefinition: RevocationRegistryDefinition | JsonObject
  revocationRegistryDefinitionPrivate: RevocationRegistryDefinitionPrivate | JsonObject
  issuerId: string
  issuanceByDefault: boolean
  timestamp?: number
}

export type UpdateRevocationStatusListTimestampOptions = {
  timestamp: number
}

export type UpdateRevocationStatusListOptions = {
  credentialDefinition: CredentialDefinition | JsonObject
  revocationRegistryDefinition: RevocationRegistryDefinition | JsonObject
  revocationRegistryDefinitionPrivate: RevocationRegistryDefinitionPrivate | JsonObject
  issued?: number[]
  revoked?: number[]
  timestamp?: number
}

export class RevocationStatusList extends AnoncredsObject {
  public static create(options: CreateRevocationStatusListOptions) {
    let revocationStatusListHandle: ObjectHandle
    const objectHandles: ObjectHandle[] = []
    try {
      const credentialDefinition =
        options.credentialDefinition instanceof CredentialDefinition
          ? options.credentialDefinition.handle
          : pushToArray(CredentialDefinition.fromJson(options.credentialDefinition).handle, objectHandles)

      const revocationRegistryDefinition =
        options.revocationRegistryDefinition instanceof RevocationRegistryDefinition
          ? options.revocationRegistryDefinition.handle
          : pushToArray(
              RevocationRegistryDefinition.fromJson(options.revocationRegistryDefinition).handle,
              objectHandles
            )

      const revocationRegistryDefinitionPrivate =
        options.revocationRegistryDefinitionPrivate instanceof RevocationRegistryDefinitionPrivate
          ? options.revocationRegistryDefinitionPrivate.handle
          : pushToArray(
              RevocationRegistryDefinitionPrivate.fromJson(options.revocationRegistryDefinitionPrivate).handle,
              objectHandles
            )

      revocationStatusListHandle = NativeAnoncreds.instance.createRevocationStatusList({
        ...options,
        credentialDefinition,
        revocationRegistryDefinition,
        revocationRegistryDefinitionPrivate,
      })
    } finally {
      for (const handle of objectHandles) {
        handle.clear()
      }
    }
    return new RevocationStatusList(revocationStatusListHandle.handle)
  }

  public static fromJson(json: JsonObject) {
    return new RevocationStatusList(
      NativeAnoncreds.instance.revocationStatusListFromJson({ json: JSON.stringify(json) }).handle
    )
  }

  public updateTimestamp(options: UpdateRevocationStatusListTimestampOptions) {
    const updatedRevocationStatusList = NativeAnoncreds.instance.updateRevocationStatusListTimestampOnly({
      timestamp: options.timestamp,
      currentRevocationStatusList: this.handle,
    })

    this.handle = updatedRevocationStatusList
  }

  public update(options: UpdateRevocationStatusListOptions) {
    const objectHandles: ObjectHandle[] = []
    try {
      const credentialDefinition =
        options.credentialDefinition instanceof CredentialDefinition
          ? options.credentialDefinition.handle
          : pushToArray(CredentialDefinition.fromJson(options.credentialDefinition).handle, objectHandles)

      const revocationRegistryDefinition =
        options.revocationRegistryDefinition instanceof RevocationRegistryDefinition
          ? options.revocationRegistryDefinition.handle
          : pushToArray(
              RevocationRegistryDefinition.fromJson(options.revocationRegistryDefinition).handle,
              objectHandles
            )

      const revocationRegistryDefinitionPrivate =
        options.revocationRegistryDefinitionPrivate instanceof RevocationRegistryDefinitionPrivate
          ? options.revocationRegistryDefinitionPrivate.handle
          : pushToArray(
              RevocationRegistryDefinitionPrivate.fromJson(options.revocationRegistryDefinitionPrivate).handle,
              objectHandles
            )

      const updatedRevocationStatusList = NativeAnoncreds.instance.updateRevocationStatusList({
        ...options,
        credentialDefinition,
        revocationRegistryDefinition,
        revocationRegistryDefinitionPrivate,
        currentRevocationStatusList: this.handle,
      })

      this.handle = updatedRevocationStatusList
    } finally {
      for (const handle of objectHandles) {
        handle.clear()
      }
    }
  }
}
