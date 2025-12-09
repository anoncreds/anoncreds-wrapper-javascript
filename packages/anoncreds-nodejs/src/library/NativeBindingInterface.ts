import type { IKoffiCType } from 'koffi'
import type { nativeBindings } from './bindings'

export type NativeMethods = {
  // Buffer management
  anoncreds_buffer_free(buffer: Buffer): void

  // String management
  anoncreds_string_free(str: IKoffiCType): void

  // Object management
  anoncreds_object_free(handle: number): void
  anoncreds_object_get_json(handle: number, out: object): number
  anoncreds_object_get_type_name(handle: number, out: [null]): number

  // Error functions
  anoncreds_get_current_error(out: [null]): number
  anoncreds_set_default_logger(): number

  // Version
  anoncreds_version(): string

  // Utility functions
  anoncreds_generate_nonce(out: [null]): number
  anoncreds_encode_credential_attributes(attr_names: object, out: [null]): number

  // Schema functions
  anoncreds_create_schema(name: string, version: string, issuer_id: string, attr_names: object, out: [null]): number
  anoncreds_schema_from_json(buffer: Buffer, out: [null]): number

  // Credential definition functions
  anoncreds_create_credential_definition(
    schema_id: string,
    schema: number,
    tag: string,
    issuer_id: string,
    signature_type: string,
    support_revocation: number,
    cred_def_out: [null],
    cred_def_priv_out: [null],
    key_correctness_proof_out: [null]
  ): number
  anoncreds_credential_definition_from_json(buffer: Buffer, out: [null]): number
  anoncreds_credential_definition_private_from_json(buffer: Buffer, out: [null]): number
  anoncreds_key_correctness_proof_from_json(buffer: Buffer, out: [null]): number

  // Link secret
  anoncreds_create_link_secret(out: [null]): number

  // Credential offer functions
  anoncreds_create_credential_offer(
    schema_id: string,
    cred_def_id: string,
    key_correctness_proof: number,
    out: [null]
  ): number
  anoncreds_credential_offer_from_json(buffer: Buffer, out: [null]): number

  // Credential request functions
  anoncreds_create_credential_request(
    entropy: string,
    prover_did: string,
    cred_def: number,
    link_secret: string,
    link_secret_id: string,
    cred_offer: number,
    cred_req_out: [null],
    cred_req_metadata_out: [null]
  ): number
  anoncreds_credential_request_from_json(buffer: Buffer, out: [null]): number
  anoncreds_credential_request_metadata_from_json(buffer: Buffer, out: [null]): number

  // Credential functions
  anoncreds_create_credential(
    cred_def: number,
    cred_def_private: number,
    cred_offer: number,
    cred_request: number,
    attr_names: object,
    attr_raw_values: object,
    attr_enc_values: object,
    revocation: any,
    out: [null]
  ): number
  anoncreds_process_credential(
    cred: number,
    cred_req_metadata: number,
    link_secret: string,
    cred_def: number,
    rev_reg_def: number,
    out: [null]
  ): number
  anoncreds_credential_get_attribute(handle: number, name: string, out: [null]): number
  anoncreds_credential_from_json(buffer: Buffer, out: [null]): number

  // Revocation registry definition functions
  anoncreds_create_revocation_registry_def(
    cred_def: number,
    cred_def_id: string,
    issuer_id: string,
    tag: string,
    rev_reg_type: string,
    max_cred_num: number,
    tails_dir_path: string,
    rev_reg_def_out: Buffer,
    rev_reg_def_private_out: Buffer
  ): number
  anoncreds_revocation_registry_definition_get_attribute(handle: number, name: string, out: [null]): number
  anoncreds_revocation_registry_definition_from_json(buffer: Buffer, out: [null]): number
  anoncreds_revocation_registry_definition_private_from_json(buffer: Buffer, out: [null]): number

  // Revocation registry functions
  anoncreds_revocation_registry_from_json(buffer: Buffer, out: [null]): number

  // Revocation status list functions
  anoncreds_create_revocation_status_list(
    rev_reg_def: number,
    rev_reg_def_id: string,
    rev_reg: number,
    rev_reg_def_private: number,
    issuance_by_default: string,
    issuance_by_default_bool: number,
    timestamp: number,
    out: [null]
  ): number
  anoncreds_update_revocation_status_list(
    cred_def: number,
    rev_reg_def: number,
    rev_reg_private: number,
    rev_current_list: number,
    issued: object,
    revoked: object,
    timestamp: number,
    out: [null]
  ): number
  anoncreds_update_revocation_status_list_timestamp_only(
    timestamp: number,
    rev_status_list: number,
    out: [null]
  ): number
  anoncreds_revocation_status_list_from_json(buffer: Buffer, out: [null]): number

  // Revocation state functions
  anoncreds_create_or_update_revocation_state(
    rev_reg_def: number,
    rev_status_list: number,
    rev_reg_idx: number,
    tails_path: string,
    old_rev_state: number,
    old_rev_status_list: number,
    out: [null]
  ): number
  anoncreds_revocation_state_from_json(buffer: Buffer, out: [null]): number

  // Presentation request functions
  anoncreds_presentation_request_from_json(buffer: Buffer, out: [null]): number

  // Presentation functions
  anoncreds_create_presentation(
    pres_req: number,
    credentials: object,
    credentials_prove: object,
    self_attested_names: object,
    self_attested_values: object,
    link_secret: string,
    schemas: object,
    schema_ids: object,
    cred_defs: object,
    cred_def_ids: object,
    out: [null]
  ): number
  anoncreds_verify_presentation(
    presentation: number,
    pres_req: number,
    schemas: object,
    schema_ids: object,
    cred_defs: object,
    cred_def_ids: object,
    rev_reg_defs: object,
    rev_reg_def_ids: object,
    rev_status_list: object,
    nonrevoked_interval_override: object,
    out: [null]
  ): number
  anoncreds_presentation_from_json(buffer: Buffer, out: [null]): number

  // W3C Credential functions (if supported)
  anoncreds_create_w3c_credential(
    cred_def: number,
    cred_def_private: number,
    cred_offer: number,
    cred_req: number,
    attr_names: object,
    attr_values: object,
    revocation: any,
    w3c_version: string,
    out: [null]
  ): number
  anoncreds_process_w3c_credential(
    w3c_credential: number,
    cred_req_metadata: number,
    link_secret: string,
    cred_def: number,
    rev_reg_def: number,
    out: [null]
  ): number
  anoncreds_create_w3c_presentation(
    pres_req: number,
    credentials: object,
    credentials_prove: object,
    link_secret: string,
    schemas: object,
    schema_ids: object,
    cred_defs: object,
    cred_def_ids: object,
    w3c_version: string,
    out: [null]
  ): number
  anoncreds_verify_w3c_presentation(
    presentation: number,
    pres_req: number,
    schemas: object,
    schema_ids: object,
    cred_defs: object,
    cred_def_ids: object,
    rev_reg_defs: object,
    rev_reg_def_ids: object,
    rev_status_lists: object,
    nonrevoked_interval_override: object,
    out: [null]
  ): number
  anoncreds_credential_to_w3c(credential: number, issuer_id: string, w3c_version: string, out: [null]): number
  anoncreds_credential_from_w3c(w3c_credential: number, out: [null]): number
  anoncreds_w3c_credential_get_integrity_proof_details(w3c_credential: number, out: [null]): number
  anoncreds_w3c_credential_proof_get_attribute(w3c_credential: number, name: string, out: [null]): number
  anoncreds_w3c_credential_from_json(buffer: Buffer, out: [null]): number
  anoncreds_w3c_presentation_from_json(buffer: Buffer, out: [null]): number
}
