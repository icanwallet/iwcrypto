module.exports = function concatBuffer(bfa,bfb){
  let aLen = Buffer.byteLength(bfa);
  let bLen = Buffer.byteLength(bfb);
  let buf  = Buffer.alloc(aLen+bLen);
  buf.fill(bfa);
  buf.fill(bfb,aLen);
  return buf;
}