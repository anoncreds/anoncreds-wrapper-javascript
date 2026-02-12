import {
  Credential,
  CredentialDefinition,
  CredentialOffer,
  CredentialRequest,
  CredentialRevocationConfig,
  CredentialRevocationState,
  LinkSecret,
  Nonce,
  Presentation,
  PresentationRequest,
  RevocationRegistryDefinition,
  RevocationStatusList,
  Schema,
  W3cCredential,
  W3cPresentation,
} from '@hyperledger/anoncreds-shared'
import { describe, expect, test } from 'vitest'

describe('API', () => {
  test('create and verify presentation', () => {
    const nonce = Nonce.generate()

    const presentationRequest = PresentationRequest.fromJson({
      nonce,
      name: 'pres_req_1',
      version: '0.1',
      requested_attributes: {
        attr1_referent: {
          name: 'name',
          issuer: 'mock:uri',
        },
        attr2_referent: {
          name: 'sex',
        },
        attr3_referent: {
          name: 'phone',
        },
        attr4_referent: {
          names: ['name', 'height'],
        },
      },
      requested_predicates: {
        predicate1_referent: { name: 'age', p_type: '>=', p_value: 18 },
      },
      non_revoked: { from: 13, to: 200 },
    })

    const schema = Schema.create({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } = CredentialDefinition.create({
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
      tag: 'some_tag',
      revocationRegistryType: 'CL_ACCUM',
      maximumCredentialNumber: 10,
    })

    const tailsPath = revocationRegistryDefinition.getTailsLocation()

    const timeCreateRevStatusList = 12
    const revocationStatusList = RevocationStatusList.create({
      credentialDefinition,
      revocationRegistryDefinitionId: 'mock:uri',
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId: 'mock:uri',
      issuanceByDefault: true,
      timestamp: timeCreateRevStatusList,
    })

    const credentialOffer = CredentialOffer.create({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = LinkSecret.create()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = CredentialRequest.create({
      entropy: 'entropy',
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = Credential.create({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
      revocationConfiguration: new CredentialRevocationConfig({
        registryDefinition: revocationRegistryDefinition,
        registryDefinitionPrivate: revocationRegistryDefinitionPrivate,
        statusList: revocationStatusList,
        registryIndex: 9,
      }),
    })

    const credentialReceived = credential.process({
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
      revocationRegistryDefinition,
    })

    const revocationRegistryIndex = credentialReceived.revocationRegistryIndex ?? 0

    const revocationState = CredentialRevocationState.create({
      revocationRegistryDefinition,
      revocationStatusList,
      revocationRegistryIndex,
      tailsPath,
    })

    const presentation = Presentation.create({
      presentationRequest,
      credentials: [
        {
          credential: credentialReceived,
          revocationState,
          timestamp: timeCreateRevStatusList,
        },
      ],
      credentialDefinitions: { 'mock:uri': credentialDefinition },
      credentialsProve: [
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr1_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr2_referent',
          reveal: false,
        },
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr4_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: true,
          referent: 'predicate1_referent',
          reveal: true,
        },
      ],
      linkSecret,
      schemas: { 'mock:uri': schema },
      selfAttest: { attr3_referent: '8-800-300' },
    })

    expect(typeof presentation.handle.handle).toBe('number')

    // Without revocation timestamp override, it shall fail
    expect(() =>
      presentation.verify({
        presentationRequest,
        schemas: { 'mock:uri': schema },
        credentialDefinitions: { 'mock:uri': credentialDefinition },
        revocationRegistryDefinitions: { 'mock:uri': revocationRegistryDefinition },
        revocationStatusLists: [revocationStatusList],
      })
    ).toThrow()

    const verify = presentation.verify({
      presentationRequest,
      schemas: { 'mock:uri': schema },
      credentialDefinitions: { 'mock:uri': credentialDefinition },
      revocationRegistryDefinitions: { 'mock:uri': revocationRegistryDefinition },
      revocationStatusLists: [revocationStatusList],
      nonRevokedIntervalOverrides: [
        {
          overrideRevocationStatusListTimestamp: 12,
          requestedFromTimestamp: 13,
          revocationRegistryDefinitionId: 'mock:uri',
        },
      ],
    })

    expect(verify).toBeTruthy()
  })

  test('create and verify presentation (no revocation use case)', () => {
    const schema = Schema.create({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } = CredentialDefinition.create({
      schemaId: 'mock:uri',
      issuerId: 'mock:uri',
      schema,
      signatureType: 'CL',
      supportRevocation: false,
      tag: 'TAG',
    })

    const credentialOffer = CredentialOffer.create({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = LinkSecret.create()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = CredentialRequest.create({
      entropy: 'entropy',
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = Credential.create({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
    })

    const credReceived = credential.process({
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
    })

    const credJson = credential.toJson()

    expect(credJson.cred_def_id).toBe('mock:uri')
    expect(credJson.schema_id).toBe('mock:uri')

    const credReceivedJson = credential.toJson()
    expect(credReceivedJson.cred_def_id).toBe('mock:uri')
    expect(credReceivedJson.schema_id).toBe('mock:uri')

    expect(credReceivedJson.signature).toBeDefined()
    expect(credReceivedJson.witness).toBeNull()

    const nonce = Nonce.generate()

    const presentationRequest = PresentationRequest.fromJson({
      nonce,
      name: 'pres_req_1',
      version: '0.1',
      requested_attributes: {
        attr1_referent: {
          name: 'name',
          issuer: 'mock:uri',
        },
        attr2_referent: {
          name: 'sex',
        },
        attr3_referent: {
          name: 'phone',
        },
        attr4_referent: {
          names: ['name', 'height'],
        },
      },
      requested_predicates: {
        predicate1_referent: { name: 'age', p_type: '>=', p_value: 18 },
      },
    })

    const presentation = Presentation.create({
      presentationRequest,
      credentials: [
        {
          credential: credReceived,
        },
      ],
      credentialDefinitions: { 'mock:uri': credentialDefinition },
      credentialsProve: [
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr1_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr2_referent',
          reveal: false,
        },
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr4_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: true,
          referent: 'predicate1_referent',
          reveal: true,
        },
      ],
      linkSecret,
      schemas: { 'mock:uri': schema },
      selfAttest: { attr3_referent: '8-800-300' },
    })

    expect(typeof presentation.handle.handle).toBe('number')

    const verify = presentation.verify({
      presentationRequest,
      schemas: { 'mock:uri': schema },
      credentialDefinitions: { 'mock:uri': credentialDefinition },
    })

    expect(verify).toBeTruthy()
  })
})

test('create and verify presentation passing only JSON objects as parameters', () => {
  const nonce = Nonce.generate()

  // a schema can be created from JSON
  const schema = Schema.fromJson({
    name: 'schema-1',
    issuerId: 'mock:uri',
    version: '1',
    attrNames: ['name', 'age', 'sex', 'height'],
  })

  expect(schema.toJson()).toStrictEqual({
    name: 'schema-1',
    issuerId: 'mock:uri',
    version: '1',
    attrNames: ['name', 'age', 'sex', 'height'],
  })

  const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } = CredentialDefinition.create({
    schemaId: 'mock:uri',
    issuerId: 'mock:uri',
    schema: {
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attrNames: ['name', 'age', 'sex', 'height'],
    },
    signatureType: 'CL',
    supportRevocation: true,
    tag: 'TAG',
  })

  const { revocationRegistryDefinition, revocationRegistryDefinitionPrivate } = RevocationRegistryDefinition.create({
    credentialDefinitionId: 'mock:uri',
    credentialDefinition,
    issuerId: 'mock:uri',
    tag: 'some_tag',
    revocationRegistryType: 'CL_ACCUM',
    maximumCredentialNumber: 10,
  })

  const timeCreateRevStatusList = 12
  const revocationStatusList = RevocationStatusList.create({
    credentialDefinition,
    revocationRegistryDefinitionId: 'mock:uri',
    revocationRegistryDefinition,
    revocationRegistryDefinitionPrivate,
    issuerId: 'mock:uri',
    issuanceByDefault: true,
    timestamp: timeCreateRevStatusList,
  })

  revocationStatusList.update({
    credentialDefinition,
    revocationRegistryDefinition,
    revocationRegistryDefinitionPrivate,
    revoked: [1],
  })
  const credentialOffer = CredentialOffer.fromJson({
    schema_id: 'mock:uri',
    cred_def_id: 'mock:uri',
    key_correctness_proof: keyCorrectnessProof.toJson(),
    nonce,
  })

  const linkSecret = '123'
  const linkSecretId = 'link secret id'

  const { credentialRequestMetadata, credentialRequest } = CredentialRequest.create({
    entropy: 'entropy',
    credentialDefinition: credentialDefinition.toJson(),
    linkSecret,
    linkSecretId,
    credentialOffer: credentialOffer.toJson(),
  })

  const credential = Credential.create({
    credentialDefinition: credentialDefinition.toJson(),
    credentialDefinitionPrivate: credentialDefinitionPrivate.toJson(),
    credentialOffer: credentialOffer.toJson(),
    credentialRequest: credentialRequest.toJson(),
    attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
    revocationConfiguration: new CredentialRevocationConfig({
      registryDefinition: revocationRegistryDefinition,
      registryDefinitionPrivate: revocationRegistryDefinitionPrivate,
      statusList: revocationStatusList,
      registryIndex: 9,
    }),
  })

  const credReceived = credential.process({
    credentialDefinition: credentialDefinition.toJson(),
    credentialRequestMetadata: credentialRequestMetadata.toJson(),
    linkSecret,
    revocationRegistryDefinition: revocationRegistryDefinition.toJson(),
  })

  const credJson = credential.toJson()

  expect(credJson.cred_def_id).toBe('mock:uri')
  expect(credJson.schema_id).toBe('mock:uri')
  expect(credJson.rev_reg_id).toBe('mock:uri')

  const credReceivedJson = credential.toJson()

  expect(credReceivedJson.cred_def_id).toBe('mock:uri')
  expect(credReceivedJson.schema_id).toBe('mock:uri')
  expect(credReceivedJson.rev_reg_id).toBe('mock:uri')

  expect(credReceivedJson.signature).toBeDefined()
  expect(credReceivedJson.witness).toBeDefined()

  const presentationRequest = {
    nonce,
    name: 'pres_req_1',
    version: '0.1',
    requested_attributes: {
      attr1_referent: {
        name: 'name',
        issuer: 'mock:uri',
      },
      attr2_referent: {
        name: 'sex',
      },
      attr3_referent: {
        name: 'phone',
      },
      attr4_referent: {
        names: ['name', 'height'],
      },
    },
    requested_predicates: {
      predicate1_referent: { name: 'age', p_type: '>=', p_value: 18 },
    },
  }

  const presentation = Presentation.create({
    presentationRequest,
    credentials: [
      {
        credential: credReceived.toJson(),
      },
    ],
    credentialDefinitions: { 'mock:uri': credentialDefinition.toJson() },
    credentialsProve: [
      {
        entryIndex: 0,
        isPredicate: false,
        referent: 'attr1_referent',
        reveal: true,
      },
      {
        entryIndex: 0,
        isPredicate: false,
        referent: 'attr2_referent',
        reveal: false,
      },
      {
        entryIndex: 0,
        isPredicate: false,
        referent: 'attr4_referent',
        reveal: true,
      },
      {
        entryIndex: 0,
        isPredicate: true,
        referent: 'predicate1_referent',
        reveal: true,
      },
    ],
    linkSecret,
    schemas: { 'mock:uri': schema.toJson() },
    selfAttest: { attr3_referent: '8-800-300' },
  })

  expect(typeof presentation.handle.handle).toBe('number')

  const verify = Presentation.fromJson(presentation.toJson()).verify({
    presentationRequest,
    schemas: { 'mock:uri': schema.toJson() },
    credentialDefinitions: { 'mock:uri': credentialDefinition.toJson() },
    revocationRegistryDefinitions: { 'mock:uri': revocationRegistryDefinition.toJson() },
    revocationStatusLists: [revocationStatusList.toJson()],
  })

  expect(verify).toBeTruthy()
})

describe('API W3C', () => {
  test('create and verify w3c presentation', () => {
    const nonce = Nonce.generate()

    const presentationRequest = PresentationRequest.fromJson({
      nonce,
      name: 'pres_req_1',
      version: '0.1',
      requested_attributes: {
        attr1_referent: {
          name: 'name',
          issuer: 'mock:uri',
        },
        attr2_referent: {
          names: ['name', 'height'],
        },
      },
      requested_predicates: {
        predicate1_referent: { name: 'age', p_type: '>=', p_value: 18 },
      },
      non_revoked: { from: 13, to: 200 },
    })

    const schema = Schema.create({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } = CredentialDefinition.create({
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
      tag: 'some_tag',
      revocationRegistryType: 'CL_ACCUM',
      maximumCredentialNumber: 10,
    })

    const tailsPath = revocationRegistryDefinition.getTailsLocation()

    const timeCreateRevStatusList = 12
    const revocationStatusList = RevocationStatusList.create({
      credentialDefinition,
      revocationRegistryDefinitionId: 'mock:uri',
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId: 'mock:uri',
      issuanceByDefault: true,
      timestamp: timeCreateRevStatusList,
    })

    const credentialOffer = CredentialOffer.create({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = LinkSecret.create()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = CredentialRequest.create({
      entropy: 'entropy',
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = W3cCredential.create({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
      revocationConfiguration: new CredentialRevocationConfig({
        registryDefinition: revocationRegistryDefinition,
        registryDefinitionPrivate: revocationRegistryDefinitionPrivate,
        statusList: revocationStatusList,
        registryIndex: 9,
      }),
    })

    const legacyCredential = credential.toLegacy()
    expect(legacyCredential.schemaId).toBe('mock:uri')
    expect(legacyCredential.credentialDefinitionId).toBe('mock:uri')

    const legacyCredentialFrom = Credential.fromW3c({ credential })
    expect(legacyCredentialFrom.schemaId).toBe('mock:uri')
    expect(legacyCredentialFrom.credentialDefinitionId).toBe('mock:uri')

    const w3cCredential = W3cCredential.fromLegacy({ credential: legacyCredential, issuerId: 'mock:uri' })
    expect(w3cCredential.schemaId).toBe('mock:uri')
    expect(w3cCredential.credentialDefinitionId).toBe('mock:uri')

    const convertedW3cCredential = legacyCredential.toW3c({ issuerId: 'mock:uri' })
    expect(convertedW3cCredential.schemaId).toBe('mock:uri')
    expect(convertedW3cCredential.credentialDefinitionId).toBe('mock:uri')

    const credentialReceived = credential.process({
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
      revocationRegistryDefinition,
    })

    const revocationRegistryIndex = credentialReceived.revocationRegistryIndex ?? 0

    const revocationState = CredentialRevocationState.create({
      revocationRegistryDefinition,
      revocationStatusList,
      revocationRegistryIndex,
      tailsPath,
    })

    const presentation = W3cPresentation.create({
      presentationRequest,
      credentials: [
        {
          credential: credentialReceived,
          revocationState,
          timestamp: timeCreateRevStatusList,
        },
      ],
      credentialDefinitions: { 'mock:uri': credentialDefinition },
      credentialsProve: [
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr1_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr2_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: true,
          referent: 'predicate1_referent',
          reveal: true,
        },
      ],
      linkSecret,
      schemas: { 'mock:uri': schema },
    })

    expect(typeof presentation.handle.handle).toBe('number')

    // Without revocation timestamp override, it shall fail
    expect(() => {
      presentation.verify({
        presentationRequest,
        schemas: { 'mock:uri': schema },
        credentialDefinitions: { 'mock:uri': credentialDefinition },
        revocationRegistryDefinitions: { 'mock:uri': revocationRegistryDefinition },
        revocationStatusLists: [revocationStatusList],
      })
    }).toThrow()

    const verify = presentation.verify({
      presentationRequest,
      schemas: { 'mock:uri': schema },
      credentialDefinitions: { 'mock:uri': credentialDefinition },
      revocationRegistryDefinitions: { 'mock:uri': revocationRegistryDefinition },
      revocationStatusLists: [revocationStatusList],
      nonRevokedIntervalOverrides: [
        {
          overrideRevocationStatusListTimestamp: 12,
          requestedFromTimestamp: 13,
          revocationRegistryDefinitionId: 'mock:uri',
        },
      ],
    })

    expect(verify).toBeTruthy()
  })

  test('create and verify w3c presentation (no revocation use case)', () => {
    const schema = Schema.create({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } = CredentialDefinition.create({
      schemaId: 'mock:uri',
      issuerId: 'mock:uri',
      schema,
      signatureType: 'CL',
      supportRevocation: false,
      tag: 'TAG',
    })

    const credentialOffer = CredentialOffer.create({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = LinkSecret.create()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = CredentialRequest.create({
      entropy: 'entropy',
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = W3cCredential.create({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
    })

    const credReceived = credential.process({
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
    })

    const nonce = Nonce.generate()

    const presentationRequest = PresentationRequest.fromJson({
      nonce,
      name: 'pres_req_1',
      version: '0.1',
      requested_attributes: {
        attr1_referent: {
          name: 'name',
          issuer: 'mock:uri',
        },
        attr2_referent: {
          names: ['name', 'height'],
        },
      },
      requested_predicates: {
        predicate1_referent: { name: 'age', p_type: '>=', p_value: 18 },
      },
    })

    const presentation = W3cPresentation.create({
      presentationRequest,
      credentials: [
        {
          credential: credReceived,
        },
      ],
      credentialDefinitions: { 'mock:uri': credentialDefinition },
      credentialsProve: [
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr1_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: false,
          referent: 'attr2_referent',
          reveal: true,
        },
        {
          entryIndex: 0,
          isPredicate: true,
          referent: 'predicate1_referent',
          reveal: true,
        },
      ],
      linkSecret,
      schemas: { 'mock:uri': schema },
    })

    expect(typeof presentation.handle.handle).toBe('number')

    const verify = presentation.verify({
      presentationRequest,
      schemas: { 'mock:uri': schema },
      credentialDefinitions: { 'mock:uri': credentialDefinition },
    })

    expect(verify).toBeTruthy()
  })
})
