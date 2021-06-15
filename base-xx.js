const util = require("./node-forge/util");
const base58 = require("./base58");
const Utf8 = require("./utf8");
const isString = function(val) {
	return typeof val === 'string' || val instanceof String;
}
const isUint8Array = function(val) {
	return val instanceof Uint8Array;
}
const isTRawStringInDiscriminator = function(_) {
	return false;
}
const __read = function(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o),
		r, ar = [],
		e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = {
			error: error
		};
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
}
const __spread = function() {
	for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	return ar;
}
export function _fromIn(inValue) {
	if (isString(inValue))
		return base58Decode(inValue);
	if (isUint8Array(inValue))
		return inValue;
	return Uint8Array.from(inValue);
}
export function _fromRawIn(inValue) {
	if (isTRawStringInDiscriminator(inValue))
		throw new Error('');
	if (isString(inValue))
		return stringToBytes(inValue);
	if (isUint8Array(inValue))
		return inValue;
	return Uint8Array.from(inValue);
}
export function base64Decode(input) {
	return stringToBytes(util.decode64(input), 'raw');
};
export function base64Encode(input) {
	return util.encode64(bytesToString(_fromIn(input), 'raw'));
};
export function base58Decode(input) {
	return base58.decode(input);
};
export function base58Encode(input) {
	return base58.encode(_fromIn(input));
};
export function base16Decode(input) {
	return stringToBytes(util.hexToBytes(input), 'raw');
};
export function base16Encode(input) {
	return util.bytesToHex(bytesToString(_fromIn(input), 'raw'));
};

export function stringToBytes(str, encoding) {
	if (encoding === void 0) {
		encoding = 'utf8';
	}
	if (encoding === 'utf8') {
		return Utf8.strToUtf8Array(str);
	} else if (encoding === 'raw') {
		return Uint8Array.from(__spread(str).map(function(c) {
			return c.charCodeAt(0);
		}));
	} else {
		throw new Error("Unsupported encoding " + encoding);
	}
};
export function bytesToString(bytes, encoding) {
	if (encoding === void 0) {
		encoding = 'utf8';
	}
	if (encoding === 'utf8') {
		return Utf8.utf8ArrayToStr(Array.from(_fromIn(bytes)));
	} else if (encoding === 'raw') {
		return Array.from(_fromIn(bytes))
			.map(function(byte) {
				return String.fromCharCode(byte);
			})
			.join('');
	} else {
		throw new Error("Unsupported encoding " + encoding);
	}
};
/**
 * Converts each character to byte
 */
export function binaryStringToBytes(str) {
	return Uint8Array.from(__spread(str).map(function(c) {
		return c.charCodeAt(0);
	}));
};
/**
 * Reads each byte as individual character
 */
export function bytesToBinaryString(bytes) {
	return Array.from(_fromIn(bytes))
		.map(function(byte) {
			return String.fromCharCode(byte);
		})
		.join('');
}
export function concat() {
	var arrays = [];
	for (var _i = 0; _i < arguments.length; _i++) {
		arrays[_i] = arguments[_i];
	}
	return arrays.reduce(function(a, b) {
		return Uint8Array.from(__spread(a, _fromIn(b)));
	}, new Uint8Array(0));
};
export function split(binary) {
	var sizes = [];
	for (var _i = 1; _i < arguments.length; _i++) {
		sizes[_i - 1] = arguments[_i];
	}
	var _a = sizes.reduce(function(a, s) {
			return ({
				arr: a.arr.slice(s),
				r: __spread(a.r, [a.arr.slice(0, s)])
			});
		}, {
			arr: _fromIn(binary),
			r: []
		}),
		r = _a.r,
		arr = _a.arr;
	return __spread(r, [arr]);
};
