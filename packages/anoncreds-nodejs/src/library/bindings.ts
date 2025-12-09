// Koffi function signatures using C-like prototypes
// Based on anoncreds-rs FFI functions
export const nativeBindings = {
  // Buffer management
  anoncreds_buffer_free: 'void anoncreds_buffer_free(ByteBuffer buffer)',

  // String management
  anoncreds_string_free: 'void anoncreds_string_free(const char *str)',

  // Object management
  anoncreds_object_free: 'void anoncreds_object_free(size_t handle)',
  anoncreds_object_get_json: 'uint anoncreds_object_get_json(size_t handle, _Out_ ByteBuffer *out)',
  anoncreds_object_get_type_name: 'uint anoncreds_object_get_type_name(size_t handle, _Out_ const char **out)',

  // Error handling
  anoncreds_get_current_error: 'uint anoncreds_get_current_error(_Out_ const char **error_json_p)',
  anoncreds_set_default_logger: 'uint anoncreds_set_default_logger()',

  // Version
  anoncreds_version: 'const char *anoncreds_version()',

  // Utility functions
  anoncreds_generate_nonce: 'uint anoncreds_generate_nonce(_Out_ const char **out)',
  anoncreds_encode_credential_attributes:
    'uint anoncreds_encode_credential_attributes(StringList attr_names, _Out_ const char **out)',

  // Schema functions
  anoncreds_create_schema:
    'uint anoncreds_create_schema(const char *name, const char *version, const char *issuer_id, StringList attr_names, _Out_ size_t *out)',
  anoncreds_schema_from_json: 'uint anoncreds_schema_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Credential definition functions
  anoncreds_create_credential_definition:
    'uint anoncreds_create_credential_definition(const char *schema_id, size_t schema, const char *tag, const char *issuer_id, const char *signature_type, int8 support_revocation, _Out_ size_t *cred_def_out, _Out_ size_t *cred_def_priv_out, _Out_ size_t *key_correctness_proof_out)',
  anoncreds_credential_definition_from_json:
    'uint anoncreds_credential_definition_from_json(ByteBuffer buffer, _Out_ size_t *out)',
  anoncreds_credential_definition_private_from_json:
    'uint anoncreds_credential_definition_private_from_json(ByteBuffer buffer, _Out_ size_t *out)',
  anoncreds_key_correctness_proof_from_json:
    'uint anoncreds_key_correctness_proof_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Link secret
  anoncreds_create_link_secret: 'uint anoncreds_create_link_secret(_Out_ const char **out)',

  // Credential offer functions
  anoncreds_create_credential_offer:
    'uint anoncreds_create_credential_offer(const char *schema_id, const char *cred_def_id, size_t key_correctness_proof, _Out_ size_t *out)',
  anoncreds_credential_offer_from_json:
    'uint anoncreds_credential_offer_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Credential request functions
  anoncreds_create_credential_request:
    'uint anoncreds_create_credential_request(const char *entropy, const char *prover_did, size_t cred_def, const char *link_secret, const char *link_secret_id, size_t cred_offer, _Out_ size_t *cred_req_out, _Out_ size_t *cred_req_metadata_out)',
  anoncreds_credential_request_from_json:
    'uint anoncreds_credential_request_from_json(ByteBuffer buffer, _Out_ size_t *out)',
  anoncreds_credential_request_metadata_from_json:
    'uint anoncreds_credential_request_metadata_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Credential functions
  anoncreds_create_credential:
    'uint anoncreds_create_credential(size_t cred_def, size_t cred_def_private, size_t cred_offer, size_t cred_request, StringList attr_names, StringList attr_raw_values, StringList attr_enc_values, const CredRevInfo *revocation, _Out_ size_t *out)',
  anoncreds_process_credential:
    'uint anoncreds_process_credential(size_t cred, size_t cred_req_metadata, const char *link_secret, size_t cred_def, size_t rev_reg_def, _Out_ size_t *out)',
  anoncreds_credential_get_attribute:
    'uint anoncreds_credential_get_attribute(size_t handle, const char *name, _Out_ const char **out)',
  anoncreds_credential_from_json: 'uint anoncreds_credential_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Revocation registry definition functions
  anoncreds_create_revocation_registry_def:
    'uint anoncreds_create_revocation_registry_def(size_t cred_def, const char *cred_def_id, const char *issuer_id, const char *tag, const char *rev_reg_type, int32 max_cred_num, const char *tails_dir_path, size_t *rev_reg_def_out, size_t *rev_reg_def_private_out)',
  anoncreds_revocation_registry_definition_get_attribute:
    'uint anoncreds_revocation_registry_definition_get_attribute(size_t handle, const char *name, _Out_ const char **out)',
  anoncreds_revocation_registry_definition_from_json:
    'uint anoncreds_revocation_registry_definition_from_json(ByteBuffer buffer, _Out_ size_t *out)',
  anoncreds_revocation_registry_definition_private_from_json:
    'uint anoncreds_revocation_registry_definition_private_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Revocation registry functions
  anoncreds_revocation_registry_from_json:
    'uint anoncreds_revocation_registry_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Revocation status list functions
  anoncreds_create_revocation_status_list:
    'uint anoncreds_create_revocation_status_list(size_t cred_def, const char *rev_reg_def_id, size_t rev_reg_def, size_t rev_reg_priv, const char *_issuer_id, int8 issuance_by_default, int64 timestamp, _Out_ size_t *out)',
  anoncreds_update_revocation_status_list:
    'uint anoncreds_update_revocation_status_list(size_t cred_def, size_t rev_reg_def, size_t rev_reg_priv, size_t rev_current_list, I32List issued, I32List revoked, int64 timestamp, _Out_ size_t *out)',
  anoncreds_update_revocation_status_list_timestamp_only:
    'uint anoncreds_update_revocation_status_list_timestamp_only(int64 timestamp, size_t rev_status_list, _Out_ size_t *out)',
  anoncreds_revocation_status_list_from_json:
    'uint anoncreds_revocation_status_list_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Revocation state functions
  anoncreds_create_or_update_revocation_state:
    'uint anoncreds_create_or_update_revocation_state(size_t rev_reg_def, size_t rev_status_list, int64 rev_reg_idx, const char *tails_path, size_t old_rev_state, size_t old_rev_status_list, _Out_ size_t *out)',
  anoncreds_revocation_state_from_json:
    'uint anoncreds_revocation_state_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Presentation request functions
  anoncreds_presentation_request_from_json:
    'uint anoncreds_presentation_request_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // Presentation functions
  anoncreds_create_presentation:
    'uint anoncreds_create_presentation(size_t pres_req, CredentialEntryList credentials, CredentialProveList credentials_prove, StringList self_attested_names, StringList self_attested_values, const char *link_secret, ObjectHandleList schemas, StringList schema_ids, ObjectHandleList cred_defs, StringList cred_def_ids, _Out_ size_t *out)',
  anoncreds_verify_presentation:
    'uint anoncreds_verify_presentation(size_t presentation, size_t pres_req, ObjectHandleList schemas, StringList schema_ids, ObjectHandleList cred_defs, StringList cred_def_ids, ObjectHandleList rev_reg_defs, StringList rev_reg_def_ids, ObjectHandleList rev_status_list, NonRevokedIntervalOverrideList nonrevoked_interval_override, _Out_ int8 *out)',
  anoncreds_presentation_from_json: 'uint anoncreds_presentation_from_json(ByteBuffer buffer, _Out_ size_t *out)',

  // W3C Credential functions
  anoncreds_create_w3c_credential:
    'uint anoncreds_create_w3c_credential(size_t cred_def, size_t cred_def_private, size_t cred_offer, size_t cred_request, StringList attr_names, StringList attr_raw_values, const CredRevInfo *revocation, const char *w3c_version, _Out_ size_t *out)',
  anoncreds_process_w3c_credential:
    'uint anoncreds_process_w3c_credential(size_t cred, size_t cred_req_metadata, const char *link_secret, size_t cred_def, size_t rev_reg_def, _Out_ size_t *out)',
  anoncreds_create_w3c_presentation:
    'uint anoncreds_create_w3c_presentation(size_t pres_req, CredentialEntryList credentials, CredentialProveList credentials_prove, const char *link_secret, ObjectHandleList schemas, StringList schema_ids, ObjectHandleList cred_defs, StringList cred_def_ids, const char *w3c_version, _Out_ size_t *out)',
  anoncreds_verify_w3c_presentation:
    'uint anoncreds_verify_w3c_presentation(size_t presentation, size_t pres_req, ObjectHandleList schemas, StringList schema_ids, ObjectHandleList cred_defs, StringList cred_def_ids, ObjectHandleList rev_reg_defs, StringList rev_reg_def_ids, ObjectHandleList rev_status_lists, NonRevokedIntervalOverrideList nonrevoked_interval_override, _Out_ int8 *out)',
  anoncreds_credential_to_w3c:
    'uint anoncreds_credential_to_w3c(size_t cred, const char *issuer_id, const char *w3c_version, _Out_ size_t *out)',
  anoncreds_credential_from_w3c: 'uint anoncreds_credential_from_w3c(size_t w3c_credential, _Out_ size_t *out)',
  anoncreds_w3c_credential_get_integrity_proof_details:
    'uint anoncreds_w3c_credential_get_integrity_proof_details(size_t w3c_credential, _Out_ size_t *out)',
  anoncreds_w3c_credential_proof_get_attribute:
    'uint anoncreds_w3c_credential_proof_get_attribute(size_t w3c_credential, const char *name, _Out_ const char **out)',
  anoncreds_w3c_credential_from_json: 'uint anoncreds_w3c_credential_from_json(ByteBuffer buffer, _Out_ size_t *out)',
  anoncreds_w3c_presentation_from_json:
    'uint anoncreds_w3c_presentation_from_json(ByteBuffer buffer, _Out_ size_t *out)',
}
