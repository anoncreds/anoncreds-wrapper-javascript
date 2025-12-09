import type {
  Anoncreds,
  AnoncredsErrorObject,
  NativeCredentialEntry,
  NativeCredentialProve,
  NativeCredentialRevocationConfig,
  NativeNonRevokedIntervalOverride,
} from '@hyperledger/anoncreds-shared'
import koffi, { type IKoffiCType, alloc } from 'koffi'

import { TextDecoder, TextEncoder } from 'util'
import { AnoncredsError, ByteBuffer, ObjectHandle } from '@hyperledger/anoncreds-shared'

import {
  ByteBufferStruct,
  CredRevInfoStruct,
  CredentialEntryListStruct,
  CredentialEntryStruct,
  CredentialProveListStruct,
  CredentialProveStruct,
  FFI_INT8,
  FFI_OBJECT_HANDLE,
  FFI_STRING,
  FFI_STRING_PTR,
  NonRevokedIntervalOverrideListStruct,
  NonRevokedIntervalOverrideStruct,
  ObjectHandleArray,
  ObjectHandleListStruct,
  StringListStruct,
  allocatePointer,
  createCredRevInfoStruct,
  createCredentialEntryListStruct,
  createCredentialEntryStruct,
  createCredentialProveListStruct,
  createCredentialProveStruct,
  createI32ListStruct,
  createNonRevokedIntervalOverrideListStruct,
  createNonRevokedIntervalOverrideStruct,
  createObjectHandleListStruct,
  createStringListStruct,
  serializeArguments,
} from './ffi'
import { getNativeAnoncreds } from './library'

function handleReturnPointer<Return>(ptr: [null]): Return {
  const value = ptr[0]
  return value as Return
}

export class NodeJSAnoncreds implements Anoncreds {
  private handleError() {
    const nativeError: [null] = [null]
    const result = getNativeAnoncreds().anoncreds_get_current_error(nativeError)
    if (result !== 0) {
      throw AnoncredsError.customError({ message: 'Failed to get current error' })
    }

    const errorJsonString = handleReturnPointer<string>(nativeError)

    const anoncredsErrorObject: AnoncredsErrorObject = JSON.parse(errorJsonString) as AnoncredsErrorObject

    if (anoncredsErrorObject.code === 0) return

    throw new AnoncredsError(anoncredsErrorObject)
  }

  public get nativeAnoncreds() {
    return getNativeAnoncreds()
  }

  public generateNonce(): string {
    const outNonceString: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_generate_nonce(outNonceString)
    if (result !== 0) {
      this.handleError()
    }

    return handleReturnPointer<string>(outNonceString)
  }

  public createSchema(options: {
    name: string
    version: string
    issuerId: string
    attributeNames: string[]
  }): ObjectHandle {
    const { name, version, issuerId, attributeNames } = serializeArguments(options)

    const outSchemaHandle: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_schema(
      name,
      version,
      issuerId,
      attributeNames,
      outSchemaHandle
    )
    if (result !== 0) {
      this.handleError()
    }

    const schemaHandle = handleReturnPointer<number>(outSchemaHandle)

    return new ObjectHandle(schemaHandle)
  }

  public revocationRegistryDefinitionGetAttribute(options: { objectHandle: ObjectHandle; name: string }) {
    const { objectHandle, name } = serializeArguments(options)

    const outString: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_revocation_registry_definition_get_attribute(
      objectHandle,
      name,
      outString
    )
    if (result !== 0) {
      this.handleError()
    }

    return handleReturnPointer<string>(outString)
  }

  public credentialGetAttribute(options: { objectHandle: ObjectHandle; name: string }) {
    const { objectHandle, name } = serializeArguments(options)

    const outString: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_credential_get_attribute(objectHandle, name, outString)
    if (result !== 0) {
      this.handleError()
    }

    return handleReturnPointer<string>(outString)
  }

  public createCredentialDefinition(options: {
    schemaId: string
    schema: ObjectHandle
    issuerId: string
    tag: string
    signatureType: string
    supportRevocation: boolean
  }): {
    credentialDefinition: ObjectHandle
    credentialDefinitionPrivate: ObjectHandle
    keyCorrectnessProof: ObjectHandle
  } {
    const { schemaId, issuerId, schema, tag, signatureType, supportRevocation } = serializeArguments(options)

    const credentialDefinitionPtr: [null] = [null]
    const credentialDefinitionPrivatePtr: [null] = [null]
    const keyCorrectnessProofPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_credential_definition(
      schemaId,
      schema,
      tag,
      issuerId,
      signatureType,
      supportRevocation,
      credentialDefinitionPtr,
      credentialDefinitionPrivatePtr,
      keyCorrectnessProofPtr
    )
    if (result !== 0) {
      this.handleError()
    }

    return {
      credentialDefinition: new ObjectHandle(handleReturnPointer<number>(credentialDefinitionPtr)),
      credentialDefinitionPrivate: new ObjectHandle(handleReturnPointer<number>(credentialDefinitionPrivatePtr)),
      keyCorrectnessProof: new ObjectHandle(handleReturnPointer<number>(keyCorrectnessProofPtr)),
    }
  }

  public createCredential(options: {
    credentialDefinition: ObjectHandle
    credentialDefinitionPrivate: ObjectHandle
    credentialOffer: ObjectHandle
    credentialRequest: ObjectHandle
    attributeRawValues: Record<string, string>
    attributeEncodedValues?: Record<string, string>
    revocationConfiguration?: NativeCredentialRevocationConfig
  }): ObjectHandle {
    const { credentialDefinition, credentialDefinitionPrivate, credentialOffer, credentialRequest } =
      serializeArguments(options)

    const attributeNames = this.convertAttributeNames(options.attributeRawValues)
    const attributeRawValues = this.convertAttributeRawValues(options.attributeRawValues)
    const attributeEncodedValues = this.convertAttributeEncodedValues(options.attributeEncodedValues)
    const revocationConfiguration = this.convertRevocationConfiguration(options.revocationConfiguration)

    const credentialPtr: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_create_credential(
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeNames,
      attributeRawValues,
      attributeEncodedValues,
      revocationConfiguration ?? null,
      credentialPtr
    )

    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(credentialPtr))
  }

  public encodeCredentialAttributes(options: { attributeRawValues: string[] }): string[] {
    const { attributeRawValues } = serializeArguments(options)

    const outStringPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_encode_credential_attributes(attributeRawValues, outStringPtr)
    if (result !== 0) {
      this.handleError()
    }

    const encodedValues = handleReturnPointer<string>(outStringPtr)

    return encodedValues.split(',')
  }

  public processCredential(options: {
    credential: ObjectHandle
    credentialRequestMetadata: ObjectHandle
    linkSecret: string
    credentialDefinition: ObjectHandle
    revocationRegistryDefinition?: ObjectHandle | undefined
  }): ObjectHandle {
    const { credential, credentialRequestMetadata, linkSecret, credentialDefinition } = serializeArguments(options)

    const outObjectHandle: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_process_credential(
      credential,
      credentialRequestMetadata,
      linkSecret,
      credentialDefinition,
      options.revocationRegistryDefinition?.handle ?? 0,
      outObjectHandle
    )

    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outObjectHandle))
  }

  public createCredentialOffer(options: {
    schemaId: string
    credentialDefinitionId: string
    keyCorrectnessProof: ObjectHandle
  }): ObjectHandle {
    const { schemaId, credentialDefinitionId, keyCorrectnessProof } = serializeArguments(options)

    const outObjectHandle: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_create_credential_offer(
      schemaId,
      credentialDefinitionId,
      keyCorrectnessProof,
      outObjectHandle
    )

    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outObjectHandle))
  }

  public createCredentialRequest(options: {
    entropy?: string
    proverDid?: string
    credentialDefinition: ObjectHandle
    linkSecret: string
    linkSecretId: string
    credentialOffer: ObjectHandle
  }): { credentialRequest: ObjectHandle; credentialRequestMetadata: ObjectHandle } {
    const { entropy, proverDid, credentialDefinition, linkSecret, linkSecretId, credentialOffer } =
      serializeArguments(options)

    const credentialRequestPtr: [null] = [null]
    const credentialRequestMetadataPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_credential_request(
      entropy,
      proverDid,
      credentialDefinition,
      linkSecret,
      linkSecretId,
      credentialOffer,
      credentialRequestPtr,
      credentialRequestMetadataPtr
    )

    if (result !== 0) {
      this.handleError()
    }

    return {
      credentialRequest: new ObjectHandle(handleReturnPointer<number>(credentialRequestPtr)),
      credentialRequestMetadata: new ObjectHandle(handleReturnPointer<number>(credentialRequestMetadataPtr)),
    }
  }

  public createLinkSecret(): string {
    const outStringPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_link_secret(outStringPtr)
    if (result !== 0) {
      this.handleError()
    }

    return handleReturnPointer<string>(outStringPtr)
  }

  public createPresentation(options: {
    presentationRequest: ObjectHandle
    credentials: NativeCredentialEntry[]
    credentialsProve: NativeCredentialProve[]
    selfAttest: Record<string, string>
    linkSecret: string
    schemas: Record<string, ObjectHandle>
    credentialDefinitions: Record<string, ObjectHandle>
  }): ObjectHandle {
    const { presentationRequest, linkSecret } = serializeArguments(options)

    const selfAttestNames = createStringListStruct({
      count: Object.keys(options.selfAttest).length,
      data: Object.keys(options.selfAttest),
    })

    const selfAttestValues = createStringListStruct({
      count: Object.values(options.selfAttest).length,
      data: Object.values(options.selfAttest),
    })

    const credentialEntryList = this.convertCredentialList(options.credentials)
    const credentialProveList = this.convertCredentialProves(options.credentialsProve)
    const { schemaIds, schemas } = this.convertSchemas(options.schemas)
    const { credentialDefinitionIds, credentialDefinitions } = this.convertCredDefs(options.credentialDefinitions)

    const outObjectHandle: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_presentation(
      presentationRequest,
      credentialEntryList,
      credentialProveList,
      selfAttestNames,
      selfAttestValues,
      linkSecret,
      schemas,
      schemaIds,
      credentialDefinitions,
      credentialDefinitionIds,
      outObjectHandle
    )

    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outObjectHandle))
  }

  public verifyPresentation(options: {
    presentation: ObjectHandle
    presentationRequest: ObjectHandle
    schemas: ObjectHandle[]
    schemaIds: string[]
    credentialDefinitions: ObjectHandle[]
    credentialDefinitionIds: string[]
    revocationRegistryDefinitions?: ObjectHandle[]
    revocationRegistryDefinitionIds?: string[]
    revocationStatusLists?: ObjectHandle[]
    nonRevokedIntervalOverrides?: NativeNonRevokedIntervalOverride[]
  }): boolean {
    // Mandatory handles
    const { presentation, presentationRequest } = serializeArguments({
      presentation: options.presentation,
      presentationRequest: options.presentationRequest,
    })

    // Build required list structs explicitly (do NOT rely on serializeArguments for Koffi struct expectations)
    const schemasList = createObjectHandleListStruct({
      count: options.schemas.length,
      data: options.schemas.map((s) => s.handle),
    }) as unknown as Buffer
    const schemaIdsList = createStringListStruct({
      count: options.schemaIds.length,
      data: options.schemaIds,
    })

    const credDefsList = createObjectHandleListStruct({
      count: options.credentialDefinitions.length,
      data: options.credentialDefinitions.map((c) => c.handle),
    }) as unknown as Buffer
    const credDefIdsList = createStringListStruct({
      count: options.credentialDefinitionIds.length,
      data: options.credentialDefinitionIds,
    })

    // Optional revocation related collections -> supply empty lists when undefined per native API contract
    const revRegDefsList = createObjectHandleListStruct({
      count: options.revocationRegistryDefinitions?.length ?? 0,
      data: (options.revocationRegistryDefinitions ?? []).map((r) => r.handle),
    }) as unknown as Buffer
    const revRegDefIdsList = createStringListStruct({
      count: options.revocationRegistryDefinitionIds?.length ?? 0,
      data: options.revocationRegistryDefinitionIds ?? [],
    })
    const revStatusLists = createObjectHandleListStruct({
      count: options.revocationStatusLists?.length ?? 0,
      data: (options.revocationStatusLists ?? []).map((r) => r.handle),
    }) as unknown as Buffer

    const nonRevokedIntervalOverrideList = this.convertNonRevokedIntervalOverrides(options.nonRevokedIntervalOverrides)

    const outInt8: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_verify_presentation(
      presentation,
      presentationRequest,
      schemasList,
      schemaIdsList,
      credDefsList,
      credDefIdsList,
      revRegDefsList,
      revRegDefIdsList,
      revStatusLists,
      nonRevokedIntervalOverrideList,
      outInt8
    )

    if (result !== 0) {
      this.handleError()
    }

    return Boolean(handleReturnPointer<number>(outInt8))
  }

  public createRevocationStatusList(options: {
    credentialDefinition: ObjectHandle
    revocationRegistryDefinitionId: string
    revocationRegistryDefinition: ObjectHandle
    revocationRegistryDefinitionPrivate: ObjectHandle
    issuerId: string
    issuanceByDefault: boolean
    timestamp?: number
  }): ObjectHandle {
    const {
      credentialDefinition,
      revocationRegistryDefinitionId,
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId,
      issuanceByDefault,
      timestamp,
    } = serializeArguments(options)

    const outObjectHandle: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_revocation_status_list(
      credentialDefinition,
      revocationRegistryDefinitionId,
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      issuerId,
      issuanceByDefault,
      timestamp ?? -1,
      outObjectHandle
    )

    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outObjectHandle))
  }

  public updateRevocationStatusListTimestampOnly(options: {
    timestamp: number
    currentRevocationStatusList: ObjectHandle
  }): ObjectHandle {
    const { currentRevocationStatusList, timestamp } = serializeArguments(options)
    const outObjectHandle: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_update_revocation_status_list_timestamp_only(
      timestamp,
      currentRevocationStatusList,
      outObjectHandle
    )

    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outObjectHandle))
  }

  public updateRevocationStatusList(options: {
    credentialDefinition: ObjectHandle
    revocationRegistryDefinition: ObjectHandle
    revocationRegistryDefinitionPrivate: ObjectHandle
    currentRevocationStatusList: ObjectHandle
    issued?: number[]
    revoked?: number[]
    timestamp?: number
  }): ObjectHandle {
    const {
      credentialDefinition,
      revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate,
      currentRevocationStatusList,
      timestamp,
    } = serializeArguments({
      credentialDefinition: options.credentialDefinition,
      revocationRegistryDefinition: options.revocationRegistryDefinition,
      revocationRegistryDefinitionPrivate: options.revocationRegistryDefinitionPrivate,
      currentRevocationStatusList: options.currentRevocationStatusList,
      timestamp: options.timestamp ?? -1,
    })

    // issued/revoked must be I32List structs, not undefined/null
    const issuedList = createI32ListStruct({
      count: options.issued?.length ?? 0,
      data: options.issued ?? [],
    })
    const revokedList = createI32ListStruct({
      count: options.revoked?.length ?? 0,
      data: options.revoked ?? [],
    })

    const newRevStatusListPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_update_revocation_status_list(
      credentialDefinition, // cred_def
      revocationRegistryDefinition, // rev_reg_def
      revocationRegistryDefinitionPrivate, // rev_reg_priv
      currentRevocationStatusList, // rev_current_list
      issuedList,
      revokedList,
      timestamp ?? -1,
      newRevStatusListPtr
    )
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(newRevStatusListPtr))
  }

  public createRevocationRegistryDefinition(options: {
    credentialDefinition: ObjectHandle
    credentialDefinitionId: string
    issuerId: string
    tag: string
    revocationRegistryType: string
    maximumCredentialNumber: number
    tailsDirectoryPath?: string
  }) {
    const {
      credentialDefinition,
      credentialDefinitionId,
      tag,
      revocationRegistryType,
      issuerId,
      maximumCredentialNumber,
      tailsDirectoryPath,
    } = serializeArguments(options)

    const revocationRegistryDefinitionPtr = allocatePointer()
    const revocationRegistryDefinitionPrivate = allocatePointer()

    const result = this.nativeAnoncreds.anoncreds_create_revocation_registry_def(
      credentialDefinition,
      credentialDefinitionId,
      issuerId,
      tag,
      revocationRegistryType,
      maximumCredentialNumber,
      tailsDirectoryPath,
      revocationRegistryDefinitionPtr,
      revocationRegistryDefinitionPrivate
    )

    if (result !== 0) {
      this.handleError()
    }

    return {
      revocationRegistryDefinition: new ObjectHandle(koffi.decode(revocationRegistryDefinitionPtr, FFI_OBJECT_HANDLE)),
      revocationRegistryDefinitionPrivate: new ObjectHandle(
        koffi.decode(revocationRegistryDefinitionPrivate, FFI_OBJECT_HANDLE)
      ),
    }
  }

  public createOrUpdateRevocationState(options: {
    revocationRegistryDefinition: ObjectHandle
    revocationStatusList: ObjectHandle
    revocationRegistryIndex: number
    tailsPath: string
    oldRevocationState?: ObjectHandle
    oldRevocationStatusList?: ObjectHandle
  }): ObjectHandle {
    const { revocationRegistryDefinition, revocationStatusList, revocationRegistryIndex, tailsPath } =
      serializeArguments(options)

    const oldRevocationState = options.oldRevocationState ?? new ObjectHandle(0)
    const oldRevocationStatusList = options.oldRevocationStatusList ?? new ObjectHandle(0)
    const outObjectHandle: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_or_update_revocation_state(
      revocationRegistryDefinition,
      revocationStatusList,
      revocationRegistryIndex,
      tailsPath,
      oldRevocationState.handle,
      oldRevocationStatusList.handle,
      outObjectHandle
    )
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outObjectHandle))
  }

  public createW3cCredential(options: {
    credentialDefinition: ObjectHandle
    credentialDefinitionPrivate: ObjectHandle
    credentialOffer: ObjectHandle
    credentialRequest: ObjectHandle
    attributeRawValues: Record<string, string>
    revocationConfiguration?: NativeCredentialRevocationConfig
    w3cVersion?: string
  }): ObjectHandle {
    const { credentialDefinition, credentialDefinitionPrivate, credentialOffer, credentialRequest, w3cVersion } =
      serializeArguments(options)

    const attributeNames = this.convertAttributeNames(options.attributeRawValues)
    const attributeRawValues = this.convertAttributeRawValues(options.attributeRawValues)
    const revocationConfiguration = this.convertRevocationConfiguration(options.revocationConfiguration)

    const credentialPtr: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_create_w3c_credential(
      credentialDefinition,
      credentialDefinitionPrivate,
      credentialOffer,
      credentialRequest,
      attributeNames,
      attributeRawValues,
      revocationConfiguration ?? null,
      w3cVersion,
      credentialPtr
    )
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(credentialPtr))
  }

  public processW3cCredential(options: {
    credential: ObjectHandle
    credentialRequestMetadata: ObjectHandle
    linkSecret: string
    credentialDefinition: ObjectHandle
    revocationRegistryDefinition?: ObjectHandle | undefined
  }): ObjectHandle {
    const { credential, credentialRequestMetadata, linkSecret, credentialDefinition } = serializeArguments(options)

    const credentialPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_process_w3c_credential(
      credential,
      credentialRequestMetadata,
      linkSecret,
      credentialDefinition,
      options.revocationRegistryDefinition?.handle ?? 0,
      credentialPtr
    )
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(credentialPtr))
  }

  public createW3cPresentation(options: {
    presentationRequest: ObjectHandle
    credentials: NativeCredentialEntry[]
    credentialsProve: NativeCredentialProve[]
    linkSecret: string
    schemas: Record<string, ObjectHandle>
    credentialDefinitions: Record<string, ObjectHandle>
    w3cVersion?: string
  }): ObjectHandle {
    const { presentationRequest, linkSecret, w3cVersion } = serializeArguments(options)

    const credentialEntryList = this.convertCredentialList(options.credentials)
    const credentialProveList = this.convertCredentialProves(options.credentialsProve)
    const { schemaIds, schemas } = this.convertSchemas(options.schemas)
    const { credentialDefinitionIds, credentialDefinitions } = this.convertCredDefs(options.credentialDefinitions)

    const presentationPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_create_w3c_presentation(
      presentationRequest,
      credentialEntryList,
      credentialProveList,
      linkSecret,
      schemas,
      schemaIds,
      credentialDefinitions,
      credentialDefinitionIds,
      w3cVersion,
      presentationPtr
    )
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(presentationPtr))
  }

  public verifyW3cPresentation(options: {
    presentation: ObjectHandle
    presentationRequest: ObjectHandle
    schemas: ObjectHandle[]
    schemaIds: string[]
    credentialDefinitions: ObjectHandle[]
    credentialDefinitionIds: string[]
    revocationRegistryDefinitions?: ObjectHandle[]
    revocationRegistryDefinitionIds?: string[]
    revocationStatusLists?: ObjectHandle[]
    nonRevokedIntervalOverrides?: NativeNonRevokedIntervalOverride[]
  }): boolean {
    const { presentation, presentationRequest } = serializeArguments({
      presentation: options.presentation,
      presentationRequest: options.presentationRequest,
    })

    const schemasList = createObjectHandleListStruct({
      count: options.schemas.length,
      data: options.schemas.map((s) => s.handle),
    }) as unknown as Buffer
    const schemaIdsList = createStringListStruct({
      count: options.schemaIds.length,
      data: options.schemaIds,
    })

    const credDefsList = createObjectHandleListStruct({
      count: options.credentialDefinitions.length,
      data: options.credentialDefinitions.map((c) => c.handle),
    }) as unknown as Buffer
    const credDefIdsList = createStringListStruct({
      count: options.credentialDefinitionIds.length,
      data: options.credentialDefinitionIds,
    })

    const revRegDefsList = createObjectHandleListStruct({
      count: options.revocationRegistryDefinitions?.length ?? 0,
      data: (options.revocationRegistryDefinitions ?? []).map((r) => r.handle),
    }) as unknown as Buffer
    const revRegDefIdsList = createStringListStruct({
      count: options.revocationRegistryDefinitionIds?.length ?? 0,
      data: options.revocationRegistryDefinitionIds ?? [],
    })
    const revStatusLists = createObjectHandleListStruct({
      count: options.revocationStatusLists?.length ?? 0,
      data: (options.revocationStatusLists ?? []).map((r) => r.handle),
    }) as unknown as Buffer

    const nonRevokedIntervalOverrideList = this.convertNonRevokedIntervalOverrides(options.nonRevokedIntervalOverrides)

    const outInt8: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_verify_w3c_presentation(
      presentation,
      presentationRequest,
      schemasList,
      schemaIdsList,
      credDefsList,
      credDefIdsList,
      revRegDefsList,
      revRegDefIdsList,
      revStatusLists,
      nonRevokedIntervalOverrideList,
      outInt8
    )
    if (result !== 0) {
      this.handleError()
    }

    return Boolean(handleReturnPointer<number>(outInt8))
  }

  public credentialToW3c(options: { objectHandle: ObjectHandle; issuerId: string; w3cVersion?: string }): ObjectHandle {
    const { objectHandle, issuerId, w3cVersion } = serializeArguments(options)

    const credPtrBuf: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_credential_to_w3c(objectHandle, issuerId, w3cVersion, credPtrBuf)

    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(credPtrBuf))
  }

  public credentialFromW3c(options: { objectHandle: ObjectHandle }): ObjectHandle {
    const { objectHandle } = serializeArguments(options)

    const outObjectHandle: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_credential_from_w3c(objectHandle, outObjectHandle)
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outObjectHandle))
  }

  public w3cCredentialGetIntegrityProofDetails(options: { objectHandle: ObjectHandle }) {
    const { objectHandle } = serializeArguments(options)

    const credProofInfoPtr: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_w3c_credential_get_integrity_proof_details(
      objectHandle,
      credProofInfoPtr
    )
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(credProofInfoPtr))
  }

  public w3cCredentialProofGetAttribute(options: { objectHandle: ObjectHandle; name: string }) {
    const { objectHandle, name } = serializeArguments(options)

    const outStringPtr: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_w3c_credential_proof_get_attribute(objectHandle, name, outStringPtr)
    if (result !== 0) {
      this.handleError()
    }

    return handleReturnPointer<string>(outStringPtr)
  }

  public w3cCredentialFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_w3c_credential_from_json, options)
  }

  public w3cPresentationFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_w3c_presentation_from_json, options)
  }

  public version(): string {
    try {
      const result = this.nativeAnoncreds.anoncreds_version()
      return result as string
    } catch (error) {
      this.handleError()
      return 'unknown'
    }
  }

  public setDefaultLogger(): void {
    this.nativeAnoncreds.anoncreds_set_default_logger()
    this.handleError()
  }

  public getCurrentError(): string {
    const outStringPtr: [null] = [null]
    const result = this.nativeAnoncreds.anoncreds_get_current_error(outStringPtr)
    if (result !== 0) {
      this.handleError()
    }

    return handleReturnPointer<string>(outStringPtr)
  }

  private objectFromJson(method: (byteBuffer: Buffer, ret: [null]) => unknown, options: { json: string }) {
    const outHandle: [null] = [null]

    const byteBuffer = ByteBuffer.fromUint8Array(new TextEncoder().encode(options.json))
    const result = method(byteBuffer as unknown as Buffer, outHandle)
    if (result !== 0) {
      this.handleError()
    }

    return new ObjectHandle(handleReturnPointer<number>(outHandle))
  }

  public presentationRequestFromJson(options: { json: string }) {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_presentation_request_from_json, options)
  }

  public credentialRequestFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_credential_request_from_json, options)
  }

  public credentialRequestMetadataFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_credential_request_metadata_from_json, options)
  }

  public revocationRegistryDefinitionFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_revocation_registry_definition_from_json, options)
  }

  public revocationRegistryFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_revocation_registry_from_json, options)
  }

  public revocationStatusListFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_revocation_status_list_from_json, options)
  }

  public revocationStateFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_revocation_state_from_json, options)
  }

  public presentationFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_presentation_from_json, options)
  }

  public credentialOfferFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_credential_offer_from_json, options)
  }

  public schemaFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_schema_from_json, options)
  }

  public credentialFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_credential_from_json, options)
  }

  public revocationRegistryDefinitionPrivateFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_revocation_registry_definition_private_from_json, options)
  }

  public credentialDefinitionFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_credential_definition_from_json, options)
  }

  public credentialDefinitionPrivateFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_credential_definition_private_from_json, options)
  }

  public keyCorrectnessProofFromJson(options: { json: string }): ObjectHandle {
    return this.objectFromJson(this.nativeAnoncreds.anoncreds_key_correctness_proof_from_json, options)
  }

  public getJson(options: { objectHandle: ObjectHandle }): string {
    const { objectHandle } = serializeArguments(options)

    const outByteBuffer: any = {}

    const result = this.nativeAnoncreds.anoncreds_object_get_json(objectHandle, outByteBuffer)
    if (result !== 0) {
      this.handleError()
    }

    const output = koffi.decode(outByteBuffer.data, 'char', outByteBuffer.len)

    this.nativeAnoncreds.anoncreds_buffer_free(outByteBuffer)

    return output
  }

  public getTypeName(options: { objectHandle: ObjectHandle }): string {
    const { objectHandle } = serializeArguments(options)

    const outStringPtr: [null] = [null]

    const result = this.nativeAnoncreds.anoncreds_object_get_type_name(objectHandle, outStringPtr)

    if (result !== 0) {
      this.handleError()
      throw new Error('Failed to get type name from object')
    }

    return handleReturnPointer<string>(outStringPtr)
  }

  public objectFree(options: { objectHandle: ObjectHandle }) {
    this.nativeAnoncreds.anoncreds_object_free(options.objectHandle.handle)
    this.handleError()
  }

  private convertCredentialList(credentials: NativeCredentialEntry[]) {
    const credentialEntries = credentials.map((value) =>
      createCredentialEntryStruct({
        credential: value.credential.handle,
        timestamp: value.timestamp ?? -1,
        rev_state: value.revocationState?.handle ?? 0,
      })
    )

    return createCredentialEntryListStruct({
      count: credentialEntries.length,
      data: credentialEntries,
    }) as unknown as Buffer
  }

  private convertCredentialProves(credentialsProve: NativeCredentialProve[]) {
    const credentialProves = credentialsProve.map((value) => {
      const { entryIndex: entry_idx, isPredicate: is_predicate, reveal, referent } = serializeArguments(value)
      return createCredentialProveStruct({ entry_idx, referent, is_predicate, reveal })
    })

    return createCredentialProveListStruct({
      count: credentialProves.length,
      data: credentialProves,
    }) as unknown as Buffer
  }

  private convertSchemas(schemas: Record<string, ObjectHandle>) {
    const schemaKeys = Object.keys(schemas)
    const schemaIds = createStringListStruct({
      count: schemaKeys.length,
      data: schemaKeys,
    })

    const schemaValues = Object.values(schemas)
    const schemasList = createObjectHandleListStruct({
      count: schemaValues.length,
      data: schemaValues.map((o) => o.handle),
    }) as unknown as Buffer
    return {
      schemaIds,
      schemas: schemasList,
    }
  }

  private convertCredDefs(credentialDefinitions: Record<string, ObjectHandle>) {
    const credentialDefinitionKeys = Object.keys(credentialDefinitions)
    const credentialDefinitionIds = createStringListStruct({
      count: credentialDefinitionKeys.length,
      data: credentialDefinitionKeys,
    })

    const credentialDefinitionValues = Object.values(credentialDefinitions)
    const credentialDefinitionsList = createObjectHandleListStruct({
      count: credentialDefinitionValues.length,
      data: credentialDefinitionValues.map((o) => o.handle),
    })
    return {
      credentialDefinitionIds,
      credentialDefinitions: credentialDefinitionsList,
    }
  }

  private convertNonRevokedIntervalOverrides(nonRevokedIntervalOverrides?: NativeNonRevokedIntervalOverride[]) {
    if (!nonRevokedIntervalOverrides) {
      return createNonRevokedIntervalOverrideListStruct({
        count: 0,
        data: [],
      })
    }

    const nativeNonRevokedIntervalOverrides = nonRevokedIntervalOverrides.map((value) => {
      const { requestedFromTimestamp, revocationRegistryDefinitionId, overrideRevocationStatusListTimestamp } =
        serializeArguments(value)
      return createNonRevokedIntervalOverrideStruct({
        rev_reg_def_id: revocationRegistryDefinitionId,
        requested_from_ts: requestedFromTimestamp,
        override_rev_status_list_ts: overrideRevocationStatusListTimestamp,
      })
    })

    return createNonRevokedIntervalOverrideListStruct({
      count: nonRevokedIntervalOverrides?.length ?? 0,
      data: nativeNonRevokedIntervalOverrides ?? [],
    })
  }

  private convertAttributeNames(attributeRawValues: Record<string, string>) {
    return createStringListStruct({
      count: Object.keys(attributeRawValues).length,
      data: Object.keys(attributeRawValues),
    }) as unknown as Buffer
  }

  private convertAttributeRawValues(attributeRawValues: Record<string, string>) {
    return createStringListStruct({
      count: Object.keys(attributeRawValues).length,
      data: Object.values(attributeRawValues),
    }) as unknown as Buffer
  }

  private convertAttributeEncodedValues(attributeEncodedValues?: Record<string, string>) {
    if (!attributeEncodedValues) {
      return createStringListStruct({
        count: 0,
        data: [],
      })
    }

    return createStringListStruct({
      count: Object.keys(attributeEncodedValues).length,
      data: Object.values(attributeEncodedValues),
    })
  }

  private convertRevocationConfiguration(revocationConfiguration?: NativeCredentialRevocationConfig) {
    if (revocationConfiguration) {
      const { revocationRegistryDefinition, revocationRegistryDefinitionPrivate, revocationStatusList, registryIndex } =
        serializeArguments(revocationConfiguration)

      return createCredRevInfoStruct({
        reg_def: revocationRegistryDefinition,
        reg_def_private: revocationRegistryDefinitionPrivate,
        status_list: revocationStatusList,
        reg_idx: registryIndex,
      })
    }
  }
}
