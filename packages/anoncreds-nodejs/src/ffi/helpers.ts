import koffi from 'koffi'

// Helper functions to create struct instances for koffi
// Since koffi structs are not callable, we need to create plain objects

export const createStringListStruct = (data: { count: number; data: string[] }) => {
  return {
    count: data.count,
    data: data.data,
  } as unknown as Buffer
}

export const createObjectHandleListStruct = (data: { count: number; data: number[] }) => {
  return {
    count: data.count,
    data: data.data,
  }
}

// I32List helper (issued / revoked lists)
export const createI32ListStruct = (data: { count: number; data: number[] }) => {
  return {
    count: data.count,
    data: data.data,
  }
}

export const createCredentialEntryStruct = (data: { credential: number; timestamp: number; rev_state: number }) => {
  return {
    credential: data.credential,
    timestamp: data.timestamp,
    rev_state: data.rev_state,
  }
}

export const createCredentialEntryListStruct = (data: { count: number; data: any[] }) => {
  return {
    count: data.count,
    data: data.data,
  }
}

export const createCredentialProveStruct = (data: {
  entry_idx: number
  referent: string
  is_predicate: number
  reveal: number
}) => {
  return {
    entry_idx: data.entry_idx,
    referent: data.referent,
    is_predicate: data.is_predicate,
    reveal: data.reveal,
  }
}

export const createCredentialProveListStruct = (data: { count: number; data: any[] }) => {
  return {
    count: data.count,
    data: data.data,
  }
}

export const createNonRevokedIntervalOverrideStruct = (data: {
  rev_reg_def_id: string
  requested_from_ts: number
  override_rev_status_list_ts: number
}) => {
  return {
    rev_reg_def_id: data.rev_reg_def_id,
    requested_from_ts: data.requested_from_ts,
    override_rev_status_list_ts: data.override_rev_status_list_ts,
  }
}

export const createNonRevokedIntervalOverrideListStruct = (data: { count: number; data: any[] }) => {
  return {
    count: data.count,
    data: data.data,
  }
}

export const createCredRevInfoStruct = (data: {
  reg_def: number
  reg_def_private: number
  status_list: number
  reg_idx: number
}) => {
  return {
    reg_def: data.reg_def,
    reg_def_private: data.reg_def_private,
    status_list: data.status_list,
    reg_idx: data.reg_idx,
  }
}
