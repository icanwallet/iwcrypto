// Base58 encoding/decoding
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var ALPHABET_MAP = {};
for (var i = 0; i < ALPHABET.length; ++i) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}
var BASE = ALPHABET.length;

module.exports = {
	encode: function (buffer) {
	    if (!buffer.length)
	        return '';
	    var digits = [0];
	    for (var i = 0; i < buffer.length; i++) {
	        for (var j = 0; j < digits.length; j++) {
	            digits[j] <<= 8;
	        }
	        digits[0] += buffer[i];
	        var carry = 0;
	        for (var k = 0; k < digits.length; k++) {
	            digits[k] += carry;
	            carry = (digits[k] / 58) | 0;
	            digits[k] %= 58;
	        }
	        while (carry) {
	            digits.push(carry % 58);
	            carry = (carry / 58) | 0;
	        }
	    }
	    for (var i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
	        digits.push(0);
	    }
	    return digits.reverse().map(function (digit) {
	        return ALPHABET[digit];
	    }).join('');
	},
    decode: function(string) {
        if (string.length === 0) return [];

        var i, j, bytes = [0];
        for (i = 0; i < string.length; ++i) {
            var c = string[i];
            if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');

            for (j = 0; j < bytes.length; ++j) bytes[j] *= BASE
            bytes[0] += ALPHABET_MAP[c];

            var carry = 0;
            for (j = 0; j < bytes.length; ++j) {
                bytes[j] += carry;
                carry = bytes[j] >> 8;
                bytes[j] &= 0xff
            }

            while (carry) {
                bytes.push(carry & 0xff);
                carry >>= 8;
            }
        }
        // deal with leading zeros
        for (i = 0; string[i] === '1' && i < string.length - 1; ++i){
            bytes.push(0);
        }

        return bytes.reverse();
    }
};
