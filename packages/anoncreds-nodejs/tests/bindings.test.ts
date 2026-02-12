import { NativeAnoncreds } from '@hyperledger/anoncreds-shared'
import { describe, expect, test } from 'vitest'

const ENTROPY = 'entropy'

describe('bindings', () => {
  test('current error', () => {
    const error = NativeAnoncreds.instance.getCurrentError()

    expect(error).toStrictEqual({
      code: 0,
      message: null,
    })
  })

  test('generate nonce', () => {
    const nonce = NativeAnoncreds.instance.generateNonce()

    expect(nonce).toBeTypeOf('string')
    expect(nonce.length).toBeGreaterThan(1)
  })

  test('create schema', () => {
    const obj = {
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['attr-1'],
    }

    const schemaObj = NativeAnoncreds.instance.createSchema(obj)

    const json = NativeAnoncreds.instance.getJson({ objectHandle: schemaObj })

    expect(JSON.parse(json)).toStrictEqual({
      name: 'schema-1',
      version: '1',
      issuerId: 'mock:uri',
      attrNames: ['attr-1'],
    })
  })

  test('create credential definition', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['attr-1'],
    })

    const { keyCorrectnessProof, credentialDefinition, credentialDefinitionPrivate } =
      NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: 'mock:uri',
        issuerId: 'mock:uri',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: true,
        tag: 'TAG',
      })

    const credDefJson = JSON.parse(NativeAnoncreds.instance.getJson({ objectHandle: credentialDefinition }))

    expect(credDefJson).toMatchObject({
      tag: 'TAG',
      type: 'CL',
      schemaId: 'mock:uri',
      issuerId: 'mock:uri',
    })

    const credDefPvtJson = JSON.parse(NativeAnoncreds.instance.getJson({ objectHandle: credentialDefinitionPrivate }))

    expect(credDefPvtJson).toHaveProperty('value')

    const keyCorrectnessProofJson = JSON.parse(NativeAnoncreds.instance.getJson({ objectHandle: keyCorrectnessProof }))

    expect(keyCorrectnessProofJson).toHaveProperty('c')
    expect(keyCorrectnessProofJson).toHaveProperty('xr_cap')
  })

  test('encode credential attributes', () => {
    const encoded = NativeAnoncreds.instance.encodeCredentialAttributes({ attributeRawValues: ['value2', 'value1'] })

    expect(encoded).toMatchObject([
      '2360207505573967335061705667247358223962382058438765247085581582985596391831',
      '27404702143883897701950953229849815393032792099783647152371385368148256400014',
    ])
  })

  test('create revocation registry', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['attr-1'],
    })

    const { credentialDefinition } = NativeAnoncreds.instance.createCredentialDefinition({
      schemaId: 'mock:uri',
      issuerId: 'mock:uri',
      schema: schemaObj,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const { revocationRegistryDefinition } = NativeAnoncreds.instance.createRevocationRegistryDefinition({
      credentialDefinitionId: 'mock:uri',
      credentialDefinition,
      issuerId: 'mock:uri',
      tag: 'default',
      revocationRegistryType: 'CL_ACCUM',
      maximumCredentialNumber: 100,
    })

    const maximumCredentialNumber = NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
      objectHandle: revocationRegistryDefinition,
      name: 'max_cred_num',
    })

    expect(maximumCredentialNumber).toStrictEqual('100')

    const json = JSON.parse(NativeAnoncreds.instance.getJson({ objectHandle: revocationRegistryDefinition }))

    expect(json).toMatchObject({
      credDefId: 'mock:uri',
      revocDefType: 'CL_ACCUM',
      tag: 'default',
      value: {
        maxCredNum: 100,
      },
    })
  })

  test('create link secret', () => {
    const linkSecret = NativeAnoncreds.instance.createLinkSecret()

    expect(linkSecret.length).toBeGreaterThan(1)
    expect(linkSecret).toBeTypeOf('string')
  })

  test('create credential offer', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['attr-1'],
    })

    const { keyCorrectnessProof } = NativeAnoncreds.instance.createCredentialDefinition({
      schemaId: 'mock:uri',
      schema: schemaObj,
      issuerId: 'mock:uri',
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const credOfferObj = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const json = JSON.parse(NativeAnoncreds.instance.getJson({ objectHandle: credOfferObj }))
    expect(json).toMatchObject({
      cred_def_id: 'mock:uri',
      schema_id: 'mock:uri',
      nonce: expect.anything(),
      key_correctness_proof: expect.anything(),
    })
  })

  test('create credential request', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['attr-1'],
    })

    const { credentialDefinition, keyCorrectnessProof } = NativeAnoncreds.instance.createCredentialDefinition({
      schemaId: 'mock:uri',
      issuerId: 'mock:uri',
      schema: schemaObj,
      signatureType: 'CL',
      supportRevocation: true,
      tag: 'TAG',
    })

    const credentialOffer = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = NativeAnoncreds.instance.createLinkSecret()
    const linkSecretId = 'link secret id'

    const { credentialRequest, credentialRequestMetadata } = NativeAnoncreds.instance.createCredentialRequest({
      entropy: ENTROPY,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credReqJson = NativeAnoncreds.instance.getJson({ objectHandle: credentialRequest })
    const credReqParsed = JSON.parse(credReqJson)

    expect(credReqParsed.cred_def_id).toBe('mock:uri')
    expect(credReqParsed.blinded_ms).toBeDefined()
    expect(credReqParsed.nonce).toBeDefined()

    const credReqMetadataJson = NativeAnoncreds.instance.getJson({ objectHandle: credentialRequestMetadata })
    const credReqMetadataParsed = JSON.parse(credReqMetadataJson)

    expect(credReqMetadataParsed.link_secret_name).toBe(linkSecretId)
    expect(credReqMetadataParsed.link_secret_blinding_data).toBeDefined()
    expect(credReqMetadataParsed.nonce).toBeDefined()
  })

  test('create and receive credential', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['attr-1'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } =
      NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: 'mock:uri',
        issuerId: 'mock:uri',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: true,
        tag: 'TAG',
      })

    const { revocationRegistryDefinition, revocationRegistryDefinitionPrivate } =
      NativeAnoncreds.instance.createRevocationRegistryDefinition({
        credentialDefinitionId: 'mock:uri',
        credentialDefinition,
        issuerId: 'mock:uri',
        tag: 'some_tag',
        revocationRegistryType: 'CL_ACCUM',
        maximumCredentialNumber: 10,
      })

    const tailsPath = NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
      objectHandle: revocationRegistryDefinition,
      name: 'tails_location',
    })

    expect(tailsPath).toBeDefined()

    const timeCreateRevStatusList = 12
    const revocationStatusList = NativeAnoncreds.instance.createRevocationStatusList({
      credentialDefinition,
      revocationRegistryDefinitionId: 'mock:uri',
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId: 'mock:uri',
      issuanceByDefault: true,
      timestamp: timeCreateRevStatusList,
    })

    const credentialOffer = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = NativeAnoncreds.instance.createLinkSecret()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = NativeAnoncreds.instance.createCredentialRequest({
      entropy: ENTROPY,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = NativeAnoncreds.instance.createCredential({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { 'attr-1': 'test' },
      revocationConfiguration: {
        revocationRegistryDefinition,
        revocationRegistryDefinitionPrivate,
        revocationStatusList,
        registryIndex: 9,
      },
    })

    const credReceived = NativeAnoncreds.instance.processCredential({
      credential,
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
      revocationRegistryDefinition,
    })

    const credJson = NativeAnoncreds.instance.getJson({ objectHandle: credential })
    const credParsed = JSON.parse(credJson)

    expect(credParsed.cred_def_id).toBe('mock:uri')
    expect(credParsed.schema_id).toBe('mock:uri')
    expect(credParsed.rev_reg_id).toBe('mock:uri')

    const credReceivedJson = NativeAnoncreds.instance.getJson({ objectHandle: credReceived })
    const credReceivedParsed = JSON.parse(credReceivedJson)

    expect(credReceivedParsed.cred_def_id).toBe('mock:uri')
    expect(credReceivedParsed.schema_id).toBe('mock:uri')
    expect(credReceivedParsed.rev_reg_id).toBe('mock:uri')
    expect(credReceivedParsed.signature).toBeDefined()
    expect(credReceivedParsed.witness).toBeDefined()
  })

  test('create and receive w3c credential', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['attr-1'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } =
      NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: 'mock:uri',
        issuerId: 'mock:uri',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: true,
        tag: 'TAG',
      })

    const { revocationRegistryDefinition, revocationRegistryDefinitionPrivate } =
      NativeAnoncreds.instance.createRevocationRegistryDefinition({
        credentialDefinitionId: 'mock:uri',
        credentialDefinition,
        issuerId: 'mock:uri',
        tag: 'some_tag',
        revocationRegistryType: 'CL_ACCUM',
        maximumCredentialNumber: 10,
      })

    const tailsPath = NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
      objectHandle: revocationRegistryDefinition,
      name: 'tails_location',
    })
    expect(tailsPath).toBeDefined()

    const timeCreateRevStatusList = 12
    const revocationStatusList = NativeAnoncreds.instance.createRevocationStatusList({
      credentialDefinition,
      revocationRegistryDefinitionId: 'mock:uri',
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId: 'mock:uri',
      issuanceByDefault: true,
      timestamp: timeCreateRevStatusList,
    })

    const credentialOffer = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = NativeAnoncreds.instance.createLinkSecret()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = NativeAnoncreds.instance.createCredentialRequest({
      entropy: ENTROPY,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = NativeAnoncreds.instance.createW3cCredential({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      revocationConfiguration: {
        revocationRegistryDefinition,
        revocationRegistryDefinitionPrivate,
        revocationStatusList,
        registryIndex: 9,
      },
      attributeRawValues: { 'attr-1': 'test' },
      // @ts-expect-error: why is this added?
      encoding: undefined,
    })

    const credReceived = NativeAnoncreds.instance.processW3cCredential({
      credential,
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
      revocationRegistryDefinition,
    })

    const credReceivedJson = NativeAnoncreds.instance.getJson({ objectHandle: credReceived })
    expect(credReceivedJson).toBeDefined()
  })

  test('create and verify presentation', () => {
    const nonce = NativeAnoncreds.instance.generateNonce()

    const presentationRequest = NativeAnoncreds.instance.presentationRequestFromJson({
      json: JSON.stringify({
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
        non_revoked: { from: 10, to: 200 },
      }),
    })

    expect(NativeAnoncreds.instance.getTypeName({ objectHandle: presentationRequest })).toBe('PresentationRequest')

    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } =
      NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: 'mock:uri',
        issuerId: 'mock:uri',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: true,
        tag: 'TAG',
      })

    const { revocationRegistryDefinition, revocationRegistryDefinitionPrivate } =
      NativeAnoncreds.instance.createRevocationRegistryDefinition({
        credentialDefinitionId: 'mock:uri',
        credentialDefinition,
        issuerId: 'mock:uri',
        tag: 'some_tag',
        revocationRegistryType: 'CL_ACCUM',
        maximumCredentialNumber: 10,
      })

    const tailsPath = NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
      objectHandle: revocationRegistryDefinition,
      name: 'tails_location',
    })

    const timeCreateRevStatusList = 12
    const revocationStatusList = NativeAnoncreds.instance.createRevocationStatusList({
      credentialDefinition,
      revocationRegistryDefinitionId: 'mock:uri',
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId: 'mock:uri',
      issuanceByDefault: true,
      timestamp: timeCreateRevStatusList,
    })

    const credentialOffer = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = NativeAnoncreds.instance.createLinkSecret()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = NativeAnoncreds.instance.createCredentialRequest({
      entropy: ENTROPY,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = NativeAnoncreds.instance.createCredential({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
      revocationConfiguration: {
        revocationRegistryDefinition,
        revocationRegistryDefinitionPrivate,
        revocationStatusList,
        registryIndex: 9,
      },
    })

    const credentialReceived = NativeAnoncreds.instance.processCredential({
      credential,
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
      revocationRegistryDefinition,
    })

    const revRegIndex = NativeAnoncreds.instance.credentialGetAttribute({
      objectHandle: credentialReceived,
      name: 'rev_reg_index',
    })

    const revocationRegistryIndex = revRegIndex === null ? 0 : Number.parseInt(revRegIndex)

    const revocationState = NativeAnoncreds.instance.createOrUpdateRevocationState({
      revocationRegistryDefinition,
      revocationStatusList,
      revocationRegistryIndex,
      tailsPath,
    })

    const presentation = NativeAnoncreds.instance.createPresentation({
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
      schemas: { 'mock:uri': schemaObj },
      selfAttest: { attr3_referent: '8-800-300' },
    })

    expect(typeof presentation.handle).toBe('number')

    const verify = NativeAnoncreds.instance.verifyPresentation({
      presentation,
      presentationRequest,
      schemas: [schemaObj],
      schemaIds: ['mock:uri'],
      credentialDefinitions: [credentialDefinition],
      credentialDefinitionIds: ['mock:uri'],
      revocationRegistryDefinitions: [revocationRegistryDefinition],
      revocationRegistryDefinitionIds: ['mock:uri'],
      revocationStatusLists: [revocationStatusList],
    })

    expect(verify).toBeTruthy()
  })

  test('create and verify w3c presentation', () => {
    const nonce = NativeAnoncreds.instance.generateNonce()

    const presentationRequest = NativeAnoncreds.instance.presentationRequestFromJson({
      json: JSON.stringify({
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
        non_revoked: { from: 10, to: 200 },
      }),
    })

    expect(NativeAnoncreds.instance.getTypeName({ objectHandle: presentationRequest })).toBe('PresentationRequest')

    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } =
      NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: 'mock:uri',
        issuerId: 'mock:uri',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: true,
        tag: 'TAG',
      })

    const { revocationRegistryDefinition, revocationRegistryDefinitionPrivate } =
      NativeAnoncreds.instance.createRevocationRegistryDefinition({
        credentialDefinitionId: 'mock:uri',
        credentialDefinition,
        issuerId: 'mock:uri',
        tag: 'some_tag',
        revocationRegistryType: 'CL_ACCUM',
        maximumCredentialNumber: 10,
      })

    const tailsPath = NativeAnoncreds.instance.revocationRegistryDefinitionGetAttribute({
      objectHandle: revocationRegistryDefinition,
      name: 'tails_location',
    })

    const timeCreateRevStatusList = 12
    const revocationStatusList = NativeAnoncreds.instance.createRevocationStatusList({
      credentialDefinition,
      revocationRegistryDefinitionId: 'mock:uri',
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId: 'mock:uri',
      issuanceByDefault: true,
      timestamp: timeCreateRevStatusList,
    })

    const credentialOffer = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = NativeAnoncreds.instance.createLinkSecret()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = NativeAnoncreds.instance.createCredentialRequest({
      entropy: ENTROPY,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = NativeAnoncreds.instance.createW3cCredential({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      revocationConfiguration: {
        revocationRegistryDefinition,
        revocationRegistryDefinitionPrivate,
        revocationStatusList,
        registryIndex: 9,
      },
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
      // @ts-expect-error: why is this added?
      encoding: undefined,
    })

    const credentialReceived = NativeAnoncreds.instance.processW3cCredential({
      credential,
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
      revocationRegistryDefinition,
    })

    const credentialProofDetails = NativeAnoncreds.instance.w3cCredentialGetIntegrityProofDetails({
      objectHandle: credentialReceived,
    })

    const revRegIndex = NativeAnoncreds.instance.w3cCredentialProofGetAttribute({
      objectHandle: credentialProofDetails,
      name: 'rev_reg_index',
    })

    const revocationRegistryIndex = revRegIndex === null ? 0 : Number.parseInt(revRegIndex)

    const revocationState = NativeAnoncreds.instance.createOrUpdateRevocationState({
      revocationRegistryDefinition,
      revocationStatusList,
      revocationRegistryIndex,
      tailsPath,
    })

    const presentation = NativeAnoncreds.instance.createW3cPresentation({
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
      schemas: { 'mock:uri': schemaObj },
    })

    expect(typeof presentation.handle).toBe('number')

    const verify = NativeAnoncreds.instance.verifyW3cPresentation({
      presentation,
      presentationRequest,
      schemas: [schemaObj],
      schemaIds: ['mock:uri'],
      credentialDefinitions: [credentialDefinition],
      credentialDefinitionIds: ['mock:uri'],
      revocationRegistryDefinitions: [revocationRegistryDefinition],
      revocationRegistryDefinitionIds: ['mock:uri'],
      revocationStatusLists: [revocationStatusList],
    })

    expect(verify).toBeTruthy()
  })

  test('create and verify presentation (no revocation use case)', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } =
      NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: 'mock:uri',
        issuerId: 'mock:uri',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: false,
        tag: 'TAG',
      })

    const credentialOffer = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = NativeAnoncreds.instance.createLinkSecret()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = NativeAnoncreds.instance.createCredentialRequest({
      entropy: ENTROPY,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = NativeAnoncreds.instance.createCredential({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
    })

    const credReceived = NativeAnoncreds.instance.processCredential({
      credential,
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
    })

    const credJson = NativeAnoncreds.instance.getJson({ objectHandle: credential })
    const credParsed = JSON.parse(credJson)

    expect(credParsed.cred_def_id).toBe('mock:uri')
    expect(credParsed.schema_id).toBe('mock:uri')

    const credReceivedJson = NativeAnoncreds.instance.getJson({ objectHandle: credReceived })
    const credReceivedParsed = JSON.parse(credReceivedJson)

    expect(credReceivedParsed.cred_def_id).toBe('mock:uri')
    expect(credReceivedParsed.schema_id).toBe('mock:uri')
    expect(credReceivedParsed.signature).toBeDefined()
    expect(credReceivedParsed.witness).toBeNull()

    const nonce = NativeAnoncreds.instance.generateNonce()

    const presentationRequest = NativeAnoncreds.instance.presentationRequestFromJson({
      json: JSON.stringify({
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
      }),
    })

    const presentation = NativeAnoncreds.instance.createPresentation({
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
      schemas: { 'mock:uri': schemaObj },
      selfAttest: { attr3_referent: '8-800-300' },
    })

    expect(typeof presentation.handle).toBe('number')

    const verify = NativeAnoncreds.instance.verifyPresentation({
      presentation,
      presentationRequest,
      schemas: [schemaObj],
      schemaIds: ['mock:uri'],
      credentialDefinitions: [credentialDefinition],
      credentialDefinitionIds: ['mock:uri'],
    })

    expect(verify).toBeTruthy()
  })

  test('create and verify w3c presentation (no revocation use case)', () => {
    const schemaObj = NativeAnoncreds.instance.createSchema({
      name: 'schema-1',
      issuerId: 'mock:uri',
      version: '1',
      attributeNames: ['name', 'age', 'sex', 'height'],
    })

    const { credentialDefinition, keyCorrectnessProof, credentialDefinitionPrivate } =
      NativeAnoncreds.instance.createCredentialDefinition({
        schemaId: 'mock:uri',
        issuerId: 'mock:uri',
        schema: schemaObj,
        signatureType: 'CL',
        supportRevocation: false,
        tag: 'TAG',
      })

    const credentialOffer = NativeAnoncreds.instance.createCredentialOffer({
      schemaId: 'mock:uri',
      credentialDefinitionId: 'mock:uri',
      keyCorrectnessProof,
    })

    const linkSecret = NativeAnoncreds.instance.createLinkSecret()
    const linkSecretId = 'link secret id'

    const { credentialRequestMetadata, credentialRequest } = NativeAnoncreds.instance.createCredentialRequest({
      entropy: ENTROPY,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
    })

    const credential = NativeAnoncreds.instance.createW3cCredential({
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeRawValues: { name: 'Alex', height: '175', age: '28', sex: 'male' },
    })

    const credReceived = NativeAnoncreds.instance.processW3cCredential({
      credential,
      credentialDefinition,
      credentialRequestMetadata,
      linkSecret,
    })

    const nonce = NativeAnoncreds.instance.generateNonce()

    const presentationRequest = NativeAnoncreds.instance.presentationRequestFromJson({
      json: JSON.stringify({
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
      }),
    })

    const presentation = NativeAnoncreds.instance.createW3cPresentation({
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
      schemas: { 'mock:uri': schemaObj },
    })

    expect(typeof presentation.handle).toBe('number')

    const verify = NativeAnoncreds.instance.verifyW3cPresentation({
      presentation,
      presentationRequest,
      schemas: [schemaObj],
      schemaIds: ['mock:uri'],
      credentialDefinitions: [credentialDefinition],
      credentialDefinitionIds: ['mock:uri'],
    })

    expect(verify).toBeTruthy()
  })
})
