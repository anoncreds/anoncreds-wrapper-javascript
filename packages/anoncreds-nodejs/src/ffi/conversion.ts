import koffi from 'koffi'

// Conversion utilities for koffi
export const byteBufferToBuffer = (buffer: { data: Buffer; len: number }): Buffer => {
  const dataAsArray = koffi.decode(buffer.data, 'uint8', buffer.len)

  return Buffer.from(dataAsArray)
}

export const secretBufferToBuffer = byteBufferToBuffer
