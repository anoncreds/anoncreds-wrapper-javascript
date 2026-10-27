import {
  Credential,
  CredentialDefinition,
  CredentialOffer,
  CredentialRequest,
  LinkSecret,
  RevocationRegistryDefinition,
  RevocationStatusList,
  Schema,
} from '@hyperledger/anoncreds-shared'
import { describe, expect, test } from 'vitest'
import { free } from './utils/free'

describe('arguments and return values', () => {
  test('returns strings that are not ASCII', () => {
    const schemaId = 'mock:schéma-ü-名前'

    const schema = Schema.create({ name: 'schéma', version: '1', issuerId: 'mock:uri', attributeNames: ['name'] })
    const { credentialDefinition, credentialDefinitionPrivate, keyCorrectnessProof } = CredentialDefinition.create({
      schemaId,
      issuerId: 'mock:uri',
      schema,
      signatureType: 'CL',
      tag: 'TAG',
    })
    const credentialOffer = CredentialOffer.create({
      schemaId,
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })
    const { credentialRequest, credentialRequestMetadata } = CredentialRequest.create({
      entropy: 'entropy',
      credentialDefinition,
      linkSecret: LinkSecret.create(),
      linkSecretId: 'link secret id',
      credentialOffer,
    })
    const credential = Credential.create({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Zoë' },
    })

    expect(credential.schemaId).toBe(schemaId)
    expect(credential.toJson().values).toMatchObject({ name: { raw: 'Zoë' } })

    free(
      schema,
      credentialDefinition,
      credentialDefinitionPrivate,
      keyCorrectnessProof,
      credentialOffer,
      credentialRequest,
      credentialRequestMetadata,
      credential
    )
  })

  test('passes lists with more than 255 entries', () => {
    const maximumCredentialNumber = 300

    const schema = Schema.create({ name: 'schema', version: '1', issuerId: 'mock:uri', attributeNames: ['name'] })
    const { credentialDefinition, credentialDefinitionPrivate, keyCorrectnessProof } = CredentialDefinition.create({
      schemaId: 'mock:uri',
      issuerId: 'mock:uri',
      schema,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })
    const { revocationRegistryDefinition, revocationRegistryDefinitionPrivate } = RevocationRegistryDefinition.create({
      credentialDefinitionId: 'mock:uri',
      credentialDefinition,
      issuerId: 'mock:uri',
      tag: 'TAG',
      revocationRegistryType: 'CL_ACCUM',
      maximumCredentialNumber,
    })
    const revocationStatusList = RevocationStatusList.create({
      credentialDefinition,
      revocationRegistryDefinitionId: 'mock:uri',
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId: 'mock:uri',
      issuanceByDefault: false,
      timestamp: 10,
    })

    revocationStatusList.update({
      credentialDefinition,
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issued: Array.from({ length: maximumCredentialNumber }, (_, index) => index),
      timestamp: 20,
    })

    expect(revocationStatusList.toJson().revocationList).toEqual(new Array(maximumCredentialNumber).fill(0))

    free(
      schema,
      credentialDefinition,
      credentialDefinitionPrivate,
      keyCorrectnessProof,
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      revocationStatusList
    )
  })
})
