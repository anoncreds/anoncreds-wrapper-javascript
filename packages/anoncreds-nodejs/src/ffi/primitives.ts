import koffi from 'koffi'

// Primitives (Koffi type names)

export const FFI_ISIZE = koffi.types.size_t
export const FFI_INT8 = koffi.types.int8
export const FFI_INT32 = koffi.types.int32
export const FFI_INT64 = koffi.types.int64
export const FFI_UINT = koffi.types.uint
export const FFI_UINT8 = koffi.types.uint8
export const FFI_ERRORCODE = FFI_UINT
export const FFI_OBJECT_HANDLE = FFI_ISIZE
export const FFI_VOID = koffi.types.void
export const FFI_STRING = koffi.types.string

// Pointers (using Koffi pointer types)

export const FFI_ISIZE_PTR = koffi.pointer(FFI_ISIZE)
export const FFI_INT8_PTR = koffi.pointer(FFI_INT8)
export const FFI_OBJECT_HANDLE_PTR = koffi.pointer(FFI_OBJECT_HANDLE)
export const FFI_STRING_PTR = koffi.pointer(FFI_STRING)
