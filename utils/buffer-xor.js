export function xor (a, b) {
  var length = Math.min(a.length, b.length)
  var buffer = new Buffer(length)

  for (var i = 0; i < length; ++i) {
    buffer[i] = a[i] ^ b[i]
  }

  return buffer
}
export function xorInplace (a, b) {
  var length = Math.min(a.length, b.length)

  for (var i = 0; i < length; ++i) {
    a[i] = a[i] ^ b[i]
  }

  return a.slice(0, length)
}
