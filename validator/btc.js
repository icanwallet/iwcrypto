var base58 = require('../base58')
var segwit = require('./util/segwit_addr.js')
var cryptoUtils = require('./util/util.js')

var DEFAULT_NETWORK_TYPE = 'prod'
const CURRENCIES = require('./btc-coins')

function getDecoded(address) {
	try {
		return base58.decode(address)
	} catch (e) {
		// if decoding fails, assume invalid address
		return null
	}
}

function getChecksum(hashFunction, payload) {
	// Each currency may implement different hashing algorithm
	switch (hashFunction) {
		// blake then keccak hash chain
		case 'blake256keccak256':
			var blake = cryptoUtils.blake2b256(payload)
			return cryptoUtils.keccak256Checksum(Buffer.from(blake, 'hex'))
		case 'blake256':
			return cryptoUtils.blake256Checksum(payload)
		case 'keccak256':
			return cryptoUtils.keccak256Checksum(payload)
		case 'sha256':
		default:
			return cryptoUtils.sha256Checksum(payload)
	}
}

function getAddressType(address, currency) {
	currency = currency || {}
	// should be 25 bytes per btc address spec and 26 decred
	var expectedLength = currency.expectedLength || 25
	var hashFunction = currency.hashFunction || 'sha256'
	var decoded = getDecoded(address)
	if (decoded) {
		var length = decoded.length

		if (length !== expectedLength) {
			return null
		}

		if (currency.regex) {
			if (!currency.regex.test(address)) {
				return false
			}
		}

		var checksum = cryptoUtils.toHex(decoded.slice(length - 4, length))
		var body = cryptoUtils.toHex(decoded.slice(0, length - 4))
		var goodChecksum = getChecksum(hashFunction, body)

		return checksum === goodChecksum ? cryptoUtils.toHex(decoded.slice(0, expectedLength - 24)) : null
	}

	return null
}

function getByNameOrSymbol(currencyNameOrSymbol) {
	const replaceAndToLower = str => str.replace(' ', '').toLowerCase()
	const nameOrSymbol = replaceAndToLower(currencyNameOrSymbol)
	return CURRENCIES.find(currency =>
		replaceAndToLower(currency.name) === nameOrSymbol ||
		replaceAndToLower(currency.symbol) === nameOrSymbol
	)
}

function isValidP2PKHandP2SHAddress(address, currency, networkType) {
	networkType = networkType || DEFAULT_NETWORK_TYPE

	let correctAddressTypes
	let addressType = getAddressType(address, currency)

	if (addressType) {
		if (networkType === 'prod' || networkType === 'testnet') {
			correctAddressTypes = currency.addressTypes[networkType]
		} else {
			correctAddressTypes = currency.addressTypes.prod.concat(currency.addressTypes.testnet)
		}

		return correctAddressTypes.indexOf(addressType) >= 0
	}

	return false
}
module.exports = function(address, currency, networkType = 'prod') {
	currency = getByNameOrSymbol(currency)
	if (currency) {
		return isValidP2PKHandP2SHAddress(address, currency, networkType) || segwit.isValidAddress(address)
	}
	return false;

}
