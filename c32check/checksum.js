"use strict";
exports.__esModule = true;
var buffer_1 = require("../utils/buffer");
var encoding_1 = require("./encoding");
var hashsha256_1 = require("../hashjs/hashsha256");
/**
 * Get the c32check checksum of a hex-encoded string
 * @param {string} dataHex - the hex string
 * @returns {string} the c32 checksum, as a bin-encoded string
 */
function c32checksum(dataHex) {
    var dataHash = hashsha256_1.hashSha256(hashsha256_1.hashSha256(buffer_1.Buffer.from(dataHex, 'hex')));
    var checksum = dataHash.slice(0, 4).toString('hex');
    return checksum;
}
/**
 * Encode a hex string as a c32check string.  This is a lot like how
 * base58check works in Bitcoin-land, but this algorithm uses the
 * z-base-32 alphabet instead of the base58 alphabet.  The algorithm
 * is as follows:
 * * calculate the c32checksum of version + data
 * * c32encode version + data + c32checksum
 * @param {number} version - the version string (between 0 and 31)
 * @param {string} data - the data to encode
 * @returns {string} the c32check representation
 */
function c32checkEncode(version, data) {
    if (version < 0 || version >= 32) {
        throw new Error('Invalid version (must be between 0 and 31)');
    }
    if (!data.match(/^[0-9a-fA-F]*$/)) {
        throw new Error('Invalid data (not a hex string)');
    }
    data = data.toLowerCase();
    if (data.length % 2 !== 0) {
        data = "0" + data;
    }
    var versionHex = version.toString(16);
    if (versionHex.length === 1) {
        versionHex = "0" + versionHex;
    }
    var checksumHex = c32checksum("" + versionHex + data);
    var c32str = encoding_1.c32encode("" + data + checksumHex);
    return "" + encoding_1.c32[version] + c32str;
}
exports.c32checkEncode = c32checkEncode;
/*
 * Decode a c32check string back into its version and data payload.  This is
 * a lot like how base58check works in Bitcoin-land, but this algorithm uses
 * the z-base-32 alphabet instead of the base58 alphabet.  The algorithm
 * is as follows:
 * * extract the version, data, and checksum
 * * verify the checksum matches c32checksum(version + data)
 * * return data
 * @param {string} c32data - the c32check-encoded string
 * @returns {array} [version (number), data (string)].  The returned data
 * will be a hex string.  Throws an exception if the checksum does not match.
 */
function c32checkDecode(c32data) {
    c32data = encoding_1.c32normalize(c32data);
    var dataHex = encoding_1.c32decode(c32data.slice(1));
    var versionChar = c32data[0];
    var version = encoding_1.c32.indexOf(versionChar);
    var checksum = dataHex.slice(-8);
    var versionHex = version.toString(16);
    if (versionHex.length === 1) {
        versionHex = "0" + versionHex;
    }
    if (c32checksum("" + versionHex + dataHex.substring(0, dataHex.length - 8)) !== checksum) {
        throw new Error('Invalid c32check string: checksum mismatch');
    }
    return [version, dataHex.substring(0, dataHex.length - 8)];
}
exports.c32checkDecode = c32checkDecode;
