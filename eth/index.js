const hdkey = require('./hdwallet.js')
const bip39 =  require('../bip39')
const PATH = `m/44'/60'/0'/0/0`
export const getWallet = (mnemonic, path = PATH, with0x = false) => {
	const wallet = hdkey.fromMnemonic(mnemonic, path)
	const address = wallet.getAddress().toString('hex')
	const privateKey = wallet.getPrivateKey().toString('hex')
	if(with0x) {
		address = '0x' + address;
		privateKey = '0x' + privateKey;
	}
	//console.log(address.length)
	//console.log(privateKey.length)
	return {
		address, privateKey
	}
}
export const getMnemonic = bip39.generateMnemonic