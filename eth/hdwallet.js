const bip39 = require('../bip39')
const hdkey = require('./hdkey')
const isBuffer = require('../utils/is-buffer')
const secp256k1 = require('../secp256k1')
const PATH = `m/44'/60'/0'/0/0`
class Wallet {
	constructor(seed, hdpath = PATH) {
		this.__hdpath = hdpath
		let value = null
		if (typeof seed === 'string') {
			value = Buffer.from(seed)
		} else if (isBuffer(seed)) {
			value = seed
		} else {
			throw new Error('Seed must be Buffer or string')
		}
		
		this.__hdwallet = hdkey.fromMasterSeed(value)
	}
	fromPrivateKey(privateKey) {
		this.__hdpath = PATH
		this.__hdwallet = hdkey.fromExtendedKey(privateKey)
	}
	isValidPrivate (privateKey) {
	  return secp256k1.privateKeyVerify(privateKey)
	}
	
	hdpath() {
		return this.__hdpath
	}

	getAddress() {
		return this.__hdwallet.derivePath(this.__hdpath).getWallet().getAddress()
	}

	getPublicKey() {
		return this.__hdwallet.derivePath(this.__hdpath).getWallet().getPublicKey()
	}

	getPrivateKey() {
		return this.__hdwallet.derivePath(this.__hdpath).getWallet().getPrivateKey()
	}


	derive(hdpath) {
		if (typeof hdpath === undefined) return this
		const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
		if (/^[0-9]+'?$/.test(hdpath)) {
			hdpath = `/${hdpath}`
		}
		clone.__hdpath = this.__hdpath + hdpath
		return clone
	}
}

const HDWallet = {
	fromMnemonic: (mnemonic, path) => {
		let value = null
		if (isBuffer(mnemonic)) {
			value = mnemonic.toString()
		} else {
			value = mnemonic
		}

		const seed = bip39.mnemonicToSeedSync(value.trim())
		return new Wallet(seed, path)
	},
	fromSeed: (seed, path) => {
		return (new Wallet()).fromSeed(seed, path)
	},
	fromPrivateKey : (privateKey) => {
		return (new Wallet()).fromPrivateKey(privateKey)
	}
}
module.exports = HDWallet
