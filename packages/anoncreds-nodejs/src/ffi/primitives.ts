import * as koffi from 'koffi'

export const FFI_UINT8 = koffi.types.uint8_t
export const FFI_UINT64 = koffi.types.uint64_t
export const FFI_USIZE = koffi.types.size_t
export const FFI_INT8 = koffi.types.int8_t
export const FFI_INT32 = koffi.types.int32_t
export const FFI_INT64 = koffi.types.int64_t
export const FFI_STRING = koffi.types.string
export const FFI_VOID = koffi.types.void
export const FFI_OBJECT_HANDLE = FFI_USIZE

export const FFI_ERROR_CODE = FFI_INT64
