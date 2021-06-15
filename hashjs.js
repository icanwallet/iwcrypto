var hash = exports;

hash.utils = require('./hashjs/utils');
hash.common = require('./hashjs/common');
hash.sha = require('./hashjs/sha');
hash.ripemd = require('./hashjs/ripemd');
hash.hmac = require('./hashjs/hmac');

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;
