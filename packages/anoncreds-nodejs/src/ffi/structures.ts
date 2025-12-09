import koffi from 'koffi'

import { FFI_INT8, FFI_INT32, FFI_INT64, FFI_ISIZE, FFI_OBJECT_HANDLE, FFI_STRING, FFI_STRING_PTR } from './primitives'

// ByteBuffer struct
export const ByteBufferStruct = koffi.struct('ByteBuffer', {
  len: FFI_INT64,
  data: koffi.pointer('uint8'),
})

export const ByteBufferStructPtr = koffi.pointer(ByteBufferStruct)

// StringList struct
export const StringListStruct = koffi.struct('StringList', {
  count: FFI_ISIZE,
  data: FFI_STRING_PTR,
})

export const StringListStructPtr = koffi.pointer(StringListStruct)

// I64List struct
export const I64ListStruct = koffi.struct('I64List', {
  count: FFI_ISIZE,
  data: koffi.pointer(FFI_INT64),
})

// I32List struct
export const I32ListStruct = koffi.struct('I32List', {
  count: FFI_ISIZE,
  data: koffi.pointer(FFI_INT32),
})

// CredRevInfo struct
export const CredRevInfoStruct = koffi.struct('CredRevInfo', {
  reg_def: FFI_OBJECT_HANDLE,
  reg_def_private: FFI_OBJECT_HANDLE,
  status_list: FFI_OBJECT_HANDLE,
  reg_idx: FFI_INT64,
})

// CredentialEntry struct
export const CredentialEntryStruct = koffi.struct('CredentialEntry', {
  credential: FFI_ISIZE,
  timestamp: FFI_INT64,
  rev_state: FFI_ISIZE,
})

export const CredentialEntryListStruct = koffi.struct('CredentialEntryList', {
  count: FFI_ISIZE,
  data: koffi.pointer(CredentialEntryStruct),
})

// CredentialProve struct
export const CredentialProveStruct = koffi.struct('CredentialProve', {
  entry_idx: FFI_INT64,
  referent: FFI_STRING,
  is_predicate: FFI_INT8,
  reveal: FFI_INT8,
})

export const CredentialProveListStruct = koffi.struct('CredentialProveList', {
  count: FFI_ISIZE,
  data: koffi.pointer(CredentialProveStruct),
})

// ObjectHandle list
export const ObjectHandleListStruct = koffi.struct('ObjectHandleList', {
  count: FFI_ISIZE,
  data: koffi.pointer(FFI_ISIZE),
})

// RevocationEntry struct
export const RevocationEntryStruct = koffi.struct('RevocationEntry', {
  def_entry_idx: FFI_INT64,
  entry: FFI_ISIZE,
  timestamp: FFI_INT64,
})

export const RevocationEntryListStruct = koffi.struct('RevocationEntryList', {
  count: FFI_ISIZE,
  data: koffi.pointer(RevocationEntryStruct),
})

// NonRevokedIntervalOverride struct
export const NonRevokedIntervalOverrideStruct = koffi.struct('NonRevokedIntervalOverride', {
  rev_reg_def_id: FFI_STRING,
  requested_from_ts: FFI_INT32,
  override_rev_status_list_ts: FFI_INT32,
})

export const NonRevokedIntervalOverrideListStruct = koffi.struct('NonRevokedIntervalOverrideList', {
  count: FFI_ISIZE,
  data: koffi.pointer(NonRevokedIntervalOverrideStruct),
})

// For compatibility - we'll keep these exports
export const StringArray = koffi.pointer(FFI_STRING)
// biome-ignore lint/suspicious/noShadowRestrictedNames: FFI struct helpers need flexible any types for dynamic data
export const Int32Array = koffi.pointer(FFI_INT32)
export const Int64Array = koffi.pointer(FFI_INT64)
export const UInt8Array = koffi.pointer('uint8')
export const ObjectHandleArray = koffi.pointer(FFI_ISIZE)

export const Int64List = Int64Array
export const Int32List = Int32Array
