import { AnoncredsObject } from '../AnoncredsObject'
import type { ObjectHandle } from '../ObjectHandle'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'
import { KeyCorrectnessProof } from './KeyCorrectnessProof'
import { pushToArray } from './utils'

export type CreateCredentialOfferOptions = {
  schemaId: string
  credentialDefinitionId: string
  keyCorrectnessProof: KeyCorrectnessProof | JsonObject
}

export class CredentialOffer extends AnoncredsObject {
  public static create(options: CreateCredentialOfferOptions) {
    let credentialOfferHandle: ObjectHandle
    // Objects created within this method must be freed up
    const objectHandles: ObjectHandle[] = []
    try {
      const keyCorrectnessProof =
        options.keyCorrectnessProof instanceof KeyCorrectnessProof
          ? options.keyCorrectnessProof.handle
          : pushToArray(KeyCorrectnessProof.fromJson(options.keyCorrectnessProof).handle, objectHandles)

      credentialOfferHandle = NativeAnoncreds.instance.createCredentialOffer({
        schemaId: options.schemaId,
        credentialDefinitionId: options.credentialDefinitionId,
        keyCorrectnessProof,
      })
    } finally {
      for (const handle of objectHandles) {
        handle.clear()
      }
    }
    return new CredentialOffer(credentialOfferHandle.handle)
  }

  public static fromJson(json: JsonObject) {
    return new CredentialOffer(NativeAnoncreds.instance.credentialOfferFromJson({ json: JSON.stringify(json) }).handle)
  }
}
