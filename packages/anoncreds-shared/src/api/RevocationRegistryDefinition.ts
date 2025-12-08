import type { ObjectHandle } from '../ObjectHandle'
import type { JsonObject } from '../types'

import { AnoncredsObject } from '../AnoncredsObject'
import { NativeAnoncreds } from '../register'

import { CredentialDefinition } from './CredentialDefinition'
import { RevocationRegistryDefinitionPrivate } from './RevocationRegistryDefinitionPrivate'
import { pushToArray } from './utils'

export type CreateRevocationRegistryDefinitionOptions = {
  credentialDefinition: CredentialDefinition | JsonObject
  credentialDefinitionId: string
  tag: string
  issuerId: string
  revocationRegistryType: string
  maximumCredentialNumber: number
  tailsDirectoryPath?: string
}

export class RevocationRegistryDefinition extends AnoncredsObject {
  public static create(options: CreateRevocationRegistryDefinitionOptions) {
    let createReturnObj: {
      revocationRegistryDefinition: ObjectHandle
      revocationRegistryDefinitionPrivate: ObjectHandle
    }
    // Objects created within this method must be freed up

    const objectHandles: ObjectHandle[] = []
    try {
      const credentialDefinition =
        options.credentialDefinition instanceof CredentialDefinition
          ? options.credentialDefinition.handle
          : pushToArray(CredentialDefinition.fromJson(options.credentialDefinition).handle, objectHandles)

      createReturnObj = NativeAnoncreds.instance.createRevocationRegistryDefinition({
        ...options,
        credentialDefinition,
      })
    } finally {
      for (const handle of objectHandles) {
        handle.clear()
      }
    }
    return {
      revocationRegistryDefinition: new RevocationRegistryDefinition(
        createReturnObj.revocationRegistryDefinition.handle
      ),
      revocationRegistryDefinitionPrivate: new RevocationRegistryDefinitionPrivate(
        createReturnObj.revocationRegistryDefinitionPrivate.handle
      ),
    }
  }

  public static fromJson(json: JsonObject) {
    return new RevocationRegistryDefinition(
      NativeAnoncreds.instance.revocationRegistryDefinitionFromJson({ json: JSON.stringify(json) }).handle
    )
  }

  public getId() {
    return NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({ objectHandle: this.handle, name: 'id' })
  }

  public getMaximumCredentialNumber() {
    return Number(
      NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
        objectHandle: this.handle,
        name: 'max_cred_num',
      })
    )
  }

  public getTailsHash() {
    return NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
      objectHandle: this.handle,
      name: 'tails_hash',
    })
  }

  public getTailsLocation() {
    return NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
      objectHandle: this.handle,
      name: 'tails_location',
    })
  }
}
