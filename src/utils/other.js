export function cloneBuffer(buffer) {
  const clone = Buffer.alloc(buffer.length);
  buffer.copy(clone);
  return buffer;
}