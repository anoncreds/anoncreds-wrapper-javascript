import koffi from 'koffi'
import { FFI_OBJECT_HANDLE } from './primitives'
import { ByteBufferStruct } from './structures'

export const allocatePointer = (): Buffer => {
  return koffi.alloc(FFI_OBJECT_HANDLE, 1)
}
