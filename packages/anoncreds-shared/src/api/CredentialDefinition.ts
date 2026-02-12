import { AnoncredsObject } from '../AnoncredsObject'
import type { ObjectHandle } from '../ObjectHandle'
import { NativeAnoncreds } from '../register'
import type { JsonObject } from '../types'
import { CredentialDefinitionPrivate } from './CredentialDefinitionPrivate'
import { KeyCorrectnessProof } from './KeyCorrectnessProof'
import { Schema } from './Schema'
import { pushToArray } from './utils'

export type CreateCredentialDefinitionOptions = {
  schemaId: string
  schema: Schema | JsonObject
  signatureType: string
  tag: string
  issuerId: string
  supportRevocation?: boolean
}

export class CredentialDefinition extends AnoncredsObject {
  public static create(options: CreateCredentialDefinitionOptions) {
    let createReturnObj: {
      credentialDefinition: ObjectHandle
      credentialDefinitionPrivate: ObjectHandle
      keyCorrectnessProof: ObjectHandle
    }

    // Objects created within this method must be freed up
    const objectHandles: ObjectHandle[] = []
    try {
      const schema =
        options.schema instanceof Schema
          ? options.schema.handle
          : pushToArray(Schema.fromJson(options.schema).handle, objectHandles)
      createReturnObj = NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: options.schemaId,
        schema,
        signatureType: options.signatureType,
        tag: options.tag,
        issuerId: options.issuerId,
        supportRevocation: options.supportRevocation ?? false,
      })
    } finally {
      for (const handle of objectHandles) {
        handle.clear()
      }
    }
    return {
      credentialDefinition: new CredentialDefinition(createReturnObj.credentialDefinition.handle),
      credentialDefinitionPrivate: new CredentialDefinitionPrivate(createReturnObj.credentialDefinitionPrivate.handle),
      keyCorrectnessProof: new KeyCorrectnessProof(createReturnObj.keyCorrectnessProof.handle),
    }
  }

  public static fromJson(json: JsonObject) {
    return new CredentialDefinition(
      NativeAnoncreds.instance.credentialDefinitionFromJson({ json: JSON.stringify(json) }).handle
    )
  }
}
