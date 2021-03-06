const Bn = require('../bn.js')
const Pipe = require('../utils/buffer-pipe')

module.exports = {
  encode,
  decode,
  read,
  readBn,
  write
}

function read (stream) {
  return readBn(stream).toString()
}

function readBn (stream) {
  const num = new Bn(0)
  let shift = 0
  let byt
  while (true) {
    byt = stream.read(1)[0]
    num.ior(new Bn(byt & 0x7f).shln(shift))
    if (byt >> 7 === 0) {
      break
    } else {
      shift += 7
    }
  }
  return num
}

function write (number, stream) {
  const num = new Bn(number)
  while (true) {
    const i = num.maskn(7).toNumber()
    num.ishrn(7)
    if (num.isZero()) {
      stream.write([i])
      break
    } else {
      stream.write([i | 0x80])
    }
  }
}

/**
 * LEB128 encodeds an interger
 * @param {String|Number} num
 * @return {Buffer}
 */
function encode (num) {
  const stream = new Pipe()
  write(num, stream)
  return stream.buffer
}

/**
 * decodes a LEB128 encoded interger
 * @param {Buffer} buffer
 * @return {String}
 */
function decode (buffer) {
  const stream = new Pipe(buffer)
  return read(stream)
}
