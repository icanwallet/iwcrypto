var jsSHA = require('../../shajs/js-sha256');
var Blake256 = require('../../blake256');
var keccak256 = require('../../sha3')['keccak256'];
var Blake2B = require('../../blake2b');
var base58 = require('../../base58');

function numberToHex (number) {
    var hex = Math.round(number).toString(16);
    if(hex.length === 1) {
        hex = '0' + hex;
    }
    return hex;
}

function hexToUint8(hexString) {
    var arr = [];
    for (var i = 0; i < hexString.length; i += 2) {
        arr.push(parseInt(hexString.substr(i, 2), 16));
    }

    return new Uint8Array(arr);
}

/* Convert a byte to string */
function byte2hexStr(byte) {
    var hexByteMap = "0123456789ABCDEF";
    var str = "";
    str += hexByteMap.charAt(byte >> 4);
    str += hexByteMap.charAt(byte & 0x0f);
    return str;
}

//byteArray
function byteArray2hexStr(byteArray) {
    var str = "";
    for (var i = 0; i < (byteArray.length - 1); i++) {
        str += byte2hexStr(byteArray[i]);
    }
    str += byte2hexStr(byteArray[i]);
    return str;
}

/* Check if a char is hex char */
function isHexChar(c) {
    if ((c >= 'A' && c <= 'F') ||
        (c >= 'a' && c <= 'f') ||
        (c >= '0' && c <= '9')) {
        return 1;
    }
    return 0;
}

/* Convert a hex char to value */
function hexChar2byte(c) {
    var d = 0;
    if (c >= 'A' && c <= 'F') {
        d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
    }
    else if (c >= 'a' && c <= 'f') {
        d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    }
    else if (c >= '0' && c <= '9') {
        d = c.charCodeAt(0) - '0'.charCodeAt(0);
    }
    return d;
}

function hexStr2byteArray(str) {
    var byteArray = Array();
    var d = 0;
    var i = 0;
    var j = 0;
    var k = 0;

    for (i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (isHexChar(c)) {
            d <<= 4;
            d += hexChar2byte(c);
            j++;
            if (0 === (j % 2)) {
                byteArray[k++] = d;
                d = 0;
            }
        }
    }
    return byteArray;
}


module.exports = {
    toHex: function (arrayOfBytes) {
        var hex = '';
        for(var i = 0; i < arrayOfBytes.length; i++) {
            hex += numberToHex(arrayOfBytes[i]);
        }
        return hex;
    },
    sha256: function (hexString) {
        var sha = new jsSHA('SHA-256', 'HEX');
        sha.update(hexString);
        return sha.getHash('HEX');
    },
    sha256Checksum: function (payload) {
        return this.sha256(this.sha256(payload)).substr(0, 8);
    },
    blake256: function (hexString) {
        return new Blake256().update(hexString, 'hex').digest('hex');
    },
    blake256Checksum: function (payload) {
        return this.blake256(this.blake256(payload)).substr(0, 8);
    },
    blake2b: function (hexString, outlen) {
        return new Blake2B(outlen).update(hexToUint8(hexString)).digest('hex');
    },
    keccak256: function (hexString) {
        return keccak256(hexString);
    },
    keccak256Checksum: function (payload) {
        return keccak256(payload).toString().substr(0, 8);
    },
    base58: base58.decode,
    byteArray2hexStr: byteArray2hexStr,
    hexStr2byteArray: hexStr2byteArray,
	blake2b256: function (hexString) {
	  return new Blake2B(32).update(Buffer.from(hexString, 'hex'), 32).digest('hex')
	}
};
