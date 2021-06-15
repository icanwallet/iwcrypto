const bip32 = require('./bip32')
const bip39 =  require('./bip39')
const PATH = `m/44'/0'/0'/0/0`
export const getMnemonic = bip39.generateMnemonic
export const getKey = (mnemonic, path = PATH) => getChild(mnemonic, path).privateKey.toString('hex')
export const getChild = (mnemonic, path = PATH) => {
	const seed = bip39.mnemonicToSeedSync(mnemonic)
	const node = bip32.fromSeed(seed)
	return node.derivePath(path)
}