class Fallback {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-useless-constructor
	constructor(_) { // nothing
	}

	decode(value) {
		return value.reduce((str, code) => {
			return str + String.fromCharCode(code);
		}, '');
	}

}
const xglobal = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global :
	typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : this;
export const TextDecoder = typeof xglobal.TextDecoder === 'undefined' ? Fallback : xglobal.TextDecoder;
