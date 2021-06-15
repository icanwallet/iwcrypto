const createHash = require('./create-hash')
const createHmac = require('./create-hmac');
function ripemd160(buffer) {
	return createHash('rmd160').update(buffer).digest()
}

function sha1(buffer) {
	return createHash('sha1').update(buffer).digest()
}

function sha256(buffer) {
	return createHash('sha256').update(buffer).digest()
}

function hash160(buffer) {
	return ripemd160(sha256(buffer))
}

function hash256(buffer) {
	return sha256(sha256(buffer))
}

function hmacSHA512(key, data) {
	
	return createHmac('sha512', key)
		.update(data)
		.digest();
}
module.exports = {
	hash160: hash160,
	hash256: hash256,
	ripemd160: ripemd160,
	sha1: sha1,
	sha256: sha256,
	hmacSHA512: hmacSHA512
}
