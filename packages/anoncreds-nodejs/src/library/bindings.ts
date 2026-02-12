import * as koffi from 'koffi'
import {
  ByteBufferStruct,
  CredRevInfoStruct,
  CredentialEntryStructList,
  CredentialProveStructList,
  FFI_ERROR_CODE,
  FFI_INT8,
  FFI_INT64,
  FFI_OBJECT_HANDLE,
  FFI_STRING,
  FFI_VOID,
  I32ListStruct,
  NonrevokedIntervalOverrideStructList,
  ObjectHandleList,
  StringListStruct,
} from '../ffi'

export const nativeBindings: Record<string, [koffi.TypeSpec, Array<koffi.TypeSpec>]> = {
  // Version and utilities
  anoncreds_version: [koffi.pointer(FFI_STRING), []],
  anoncreds_set_default_logger: [FFI_ERROR_CODE, []],

  // Error handling
  anoncreds_get_current_error: [FFI_ERROR_CODE, [koffi.out(koffi.pointer(FFI_STRING))]],

  // Nonce
  anoncreds_generate_nonce: [FFI_ERROR_CODE, [koffi.out(koffi.pointer(FFI_STRING))]],

  // Buffer and memory management
  anoncreds_buffer_free: [FFI_VOID, [ByteBufferStruct]],
  anoncreds_string_free: [FFI_VOID, [koffi.pointer(FFI_STRING)]],
  anoncreds_object_free: [FFI_VOID, [FFI_OBJECT_HANDLE]],

  // Object operations
  anoncreds_object_get_json: [FFI_ERROR_CODE, [FFI_OBJECT_HANDLE, koffi.out(koffi.pointer(ByteBufferStruct))]],
  anoncreds_object_get_type_name: [FFI_ERROR_CODE, [FFI_OBJECT_HANDLE, koffi.out(koffi.pointer(FFI_STRING))]],

  // Schema operations
  anoncreds_create_schema: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_STRING, StringListStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_schema_from_json: [FFI_ERROR_CODE, [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))]],

  // Credential definition operations
  anoncreds_create_credential_definition: [
    FFI_ERROR_CODE,
    [
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_STRING,
      FFI_STRING,
      FFI_INT8,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_credential_definition_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_credential_definition_private_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Key correctness proof
  anoncreds_key_correctness_proof_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Revocation registry operations
  anoncreds_create_revocation_registry_def: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_STRING,
      FFI_STRING,
      FFI_STRING,
      FFI_INT64,
      FFI_STRING,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_revocation_registry_definition_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_revocation_registry_definition_private_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_revocation_registry_definition_get_attribute: [
    FFI_ERROR_CODE,
    [FFI_OBJECT_HANDLE, FFI_STRING, koffi.out(koffi.pointer(FFI_STRING))],
  ],
  anoncreds_revocation_registry_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Revocation status list operations
  anoncreds_create_revocation_status_list: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_INT8,
      FFI_INT64,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_update_revocation_status_list: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      I32ListStruct,
      I32ListStruct,
      FFI_INT64,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_update_revocation_status_list_timestamp_only: [
    FFI_ERROR_CODE,
    [FFI_INT64, FFI_OBJECT_HANDLE, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_revocation_status_list_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Revocation state operations
  anoncreds_create_or_update_revocation_state: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_INT64,
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_revocation_state_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Link secret operations
  anoncreds_create_link_secret: [FFI_ERROR_CODE, [koffi.out(koffi.pointer(FFI_STRING))]],

  // Credential offer operations
  anoncreds_create_credential_offer: [
    FFI_ERROR_CODE,
    [FFI_STRING, FFI_STRING, FFI_OBJECT_HANDLE, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_credential_offer_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Credential request operations
  anoncreds_create_credential_request: [
    FFI_ERROR_CODE,
    [
      FFI_STRING,
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_credential_request_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_credential_request_metadata_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Credential operations
  anoncreds_create_credential: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      StringListStruct,
      StringListStruct,
      StringListStruct,
      koffi.pointer(CredRevInfoStruct),
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_credential_from_json: [FFI_ERROR_CODE, [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))]],
  anoncreds_credential_get_attribute: [
    FFI_ERROR_CODE,
    [FFI_OBJECT_HANDLE, FFI_STRING, koffi.out(koffi.pointer(FFI_STRING))],
  ],
  anoncreds_process_credential: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_encode_credential_attributes: [FFI_ERROR_CODE, [StringListStruct, koffi.out(koffi.pointer(FFI_STRING))]],

  // W3C Credential operations
  anoncreds_create_w3c_credential: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      StringListStruct,
      StringListStruct,
      koffi.pointer(CredRevInfoStruct),
      FFI_STRING,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_w3c_credential_from_json: [FFI_ERROR_CODE, [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))]],
  anoncreds_credential_to_w3c: [
    FFI_ERROR_CODE,
    [FFI_OBJECT_HANDLE, FFI_STRING, FFI_STRING, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_credential_from_w3c: [FFI_ERROR_CODE, [FFI_OBJECT_HANDLE, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))]],
  anoncreds_process_w3c_credential: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      FFI_STRING,
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_w3c_credential_get_integrity_proof_details: [
    FFI_ERROR_CODE,
    [FFI_OBJECT_HANDLE, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_w3c_credential_proof_get_attribute: [
    FFI_ERROR_CODE,
    [FFI_OBJECT_HANDLE, FFI_STRING, koffi.out(koffi.pointer(FFI_STRING))],
  ],

  // Presentation request operations
  anoncreds_presentation_request_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],

  // Presentation operations
  anoncreds_create_presentation: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      CredentialEntryStructList,
      CredentialProveStructList,
      StringListStruct,
      StringListStruct,
      FFI_STRING,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      StringListStruct,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_presentation_from_json: [FFI_ERROR_CODE, [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))]],
  anoncreds_verify_presentation: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      NonrevokedIntervalOverrideStructList,
      koffi.out(koffi.pointer(FFI_INT8)),
    ],
  ],

  // W3C Presentation operations
  anoncreds_create_w3c_presentation: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      CredentialEntryStructList,
      CredentialProveStructList,
      FFI_STRING,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      StringListStruct,
      FFI_STRING,
      koffi.out(koffi.pointer(FFI_OBJECT_HANDLE)),
    ],
  ],
  anoncreds_w3c_presentation_from_json: [
    FFI_ERROR_CODE,
    [ByteBufferStruct, koffi.out(koffi.pointer(FFI_OBJECT_HANDLE))],
  ],
  anoncreds_verify_w3c_presentation: [
    FFI_ERROR_CODE,
    [
      FFI_OBJECT_HANDLE,
      FFI_OBJECT_HANDLE,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      StringListStruct,
      ObjectHandleList,
      NonrevokedIntervalOverrideStructList,
      koffi.out(koffi.pointer(FFI_INT8)),
    ],
  ],
} as const
