// Copyright 2017-2021 @polkadot/x-textencoder authors & contributors
// SPDX-License-Identifier: Apache-2.0
const xglobal = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global :
	typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : this;
class Fallback {
  encode(value) {
    const u8a = new Uint8Array(value.length);

    for (let i = 0; i < value.length; i++) {
      u8a[i] = value.charCodeAt(i);
    }

    return u8a;
  }

}
export const TextEncoder = typeof xglobal.TextEncoder === 'undefined' ? Fallback : xglobal.TextEncoder;