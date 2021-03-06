/*
 * From https://github.com/wzbg/base58check
 * @Author: zyc
 * @Date:   2016-09-11 23:36:05
 */
'use strict';
exports.__esModule = true;
var buffer_1 = require("../utils/buffer");
var hashsha256_1 = require("../hashjs/hashsha256");
var basex = require("../base-x");
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function encode(data, prefix, encoding) {
    if (prefix === void 0) { prefix = '00'; }
    if (encoding === void 0) { encoding = 'hex'; }
    if (typeof data === 'string') {
        data = new buffer_1.Buffer(data, encoding);
    }
    if (!(data instanceof buffer_1.Buffer)) {
        throw new TypeError('"data" argument must be an Array of Buffers');
    }
    if (!(prefix instanceof buffer_1.Buffer)) {
        prefix = new buffer_1.Buffer(prefix, encoding);
    }
    var hash = buffer_1.Buffer.concat([prefix, data]);
    hash = hashsha256_1.hashSha256(hash);
    hash = hashsha256_1.hashSha256(hash);
    hash = buffer_1.Buffer.concat([prefix, data, hash.slice(0, 4)]);
    return basex(ALPHABET).encode(hash);
}
exports.encode = encode;
function decode(string, encoding) {
    var buffer = new buffer_1.Buffer(basex(ALPHABET).decode(string));
    var prefix = buffer.slice(0, 1);
    var data = buffer.slice(1, -4);
    var hash = buffer_1.Buffer.concat([prefix, data]);
    hash = hashsha256_1.hashSha256(hash);
    hash = hashsha256_1.hashSha256(hash);
    buffer.slice(-4).forEach(function (check, index) {
        if (check !== hash[index]) {
            throw new Error('Invalid checksum');
        }
    });
    if (encoding) {
        prefix = prefix.toString(encoding);
        data = data.toString(encoding);
    }
    return { prefix: prefix, data: data };
}
exports.decode = decode;
