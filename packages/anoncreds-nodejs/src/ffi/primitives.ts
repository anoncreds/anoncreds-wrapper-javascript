import * as koffi from 'koffi'

export const FFI_UINT8 = koffi.types.uint8_t
export const FFI_UINT64 = koffi.types.uint64_t
export const FFI_USIZE = koffi.types.size_t
export const FFI_INT8 = koffi.types.int8_t
export const FFI_INT32 = koffi.types.int32_t
export const FFI_INT64 = koffi.types.int64_t
export const FFI_STRING = koffi.types.string
export const FFI_VOID = koffi.types.void

// AnonCreds allocates the strings it returns: return values and out parameters. koffi converts these to a JS string and
// then calls anoncreds_string_free on the original pointer. Strings that JS passes to AnonCreds use FFI_STRING
let freeAnoncredsString: ((pointer: unknown) => void) | undefined
export const setFreeAnoncredsString = (free: (pointer: unknown) => void) => {
  freeAnoncredsString = free
}
export const FFI_ANONCREDS_STRING = koffi.disposable('anoncreds_string', FFI_STRING, (pointer: unknown) => {
  if (pointer) freeAnoncredsString?.(pointer)
})

export const FFI_OBJECT_HANDLE = FFI_USIZE

export const FFI_ERROR_CODE = FFI_INT64
