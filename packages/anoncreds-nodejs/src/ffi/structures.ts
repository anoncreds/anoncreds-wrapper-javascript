import koffi from 'koffi'
import { FFI_INT8, FFI_INT32, FFI_INT64, FFI_OBJECT_HANDLE, FFI_STRING, FFI_UINT8, FFI_USIZE } from './primitives'

export const ByteBufferStruct = koffi.struct('ByteBufferStruct', {
  len: FFI_INT64,
  data: koffi.pointer(FFI_UINT8),
})

export type ByteBufferStructType = {
  len: number
  data: Uint8Array
}

export const StringListStruct = koffi.struct('StringListStruct', {
  count: FFI_USIZE,
  data: koffi.pointer(FFI_STRING),
})

export const I32ListStruct = koffi.struct('I32ListStruct', {
  count: FFI_USIZE,
  data: koffi.pointer(FFI_INT32),
})

export const CredRevInfoStruct = koffi.struct('CredRevInfoStruct', {
  reg_def: FFI_OBJECT_HANDLE,
  reg_def_private: FFI_OBJECT_HANDLE,
  status_list: FFI_OBJECT_HANDLE,
  reg_idx: FFI_INT64,
})

export const CredentialEntryStruct = koffi.struct('CredentialEntryStruct', {
  credential: FFI_OBJECT_HANDLE,
  timestamp: FFI_INT32,
  rev_state: FFI_OBJECT_HANDLE,
})

export const CredentialEntryStructList = koffi.struct('CredentialEntryStructList', {
  count: FFI_USIZE,
  data: koffi.pointer(CredentialEntryStruct),
})

export const CredentialProveStruct = koffi.struct('CredentialProveStruct', {
  entry_idx: FFI_INT64,
  referent: FFI_STRING,
  is_predicate: FFI_INT8,
  reveal: FFI_INT8,
})

export const CredentialProveStructList = koffi.struct('CredentialProveStructList', {
  count: FFI_USIZE,
  data: koffi.pointer(CredentialProveStruct),
})

export const ObjectHandleList = koffi.struct('ObjectHandleList', {
  count: FFI_USIZE,
  data: koffi.pointer(FFI_OBJECT_HANDLE),
})

export const NonrevokedIntervalOverrideStruct = koffi.struct('NonrevokedIntervalOverrideStruct', {
  rev_reg_def_id: FFI_STRING,
  requested_from_ts: FFI_INT32,
  override_rev_status_list_ts: FFI_INT32,
})

export const NonrevokedIntervalOverrideStructList = koffi.struct('NonrevokedIntervalOverrideStructList', {
  count: FFI_USIZE,
  data: koffi.pointer(NonrevokedIntervalOverrideStruct),
})
