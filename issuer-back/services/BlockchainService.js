const Constants = require("../constants/Constants");
const { BlockchainManager } = require("@proyecto-didi/didi-blockchain-manager");
const Messages = require("../constants/Messages");
const Register = require("../models/Register");
const Delegate = require("../models/Delegate");

const { delegateTypes } = require("ethr-did-resolver");
const regName = delegateTypes.Secp256k1SignatureAuthentication2018;

// Instancia del Blockchain Manager
const config = {
	gasPrice: 10000,
	providerConfig: Constants.BLOCKCHAIN.PROVIDER_CONFIG // for multiblockchain
};

const blockchainManager = new BlockchainManager(config, Constants.BLOCKCHAIN.GAS_INCREMENT);

module.exports.addDelegate = async function (registerId, otherDID) {
	try {
		const { did, key: privateKey } = await Register.getCredentials(registerId);
		const credentials = { did, privateKey };

		return await blockchainManager.addDelegate(credentials, otherDID, Constants.BLOCKCHAIN.DELEGATE_DURATION);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.DELEGATE);
	}
};

// anula la delegacion de "userDID" a "otherDID" de existir esta
module.exports.removeDelegate = async function (otherDID) {
	try {
		const {
			register: { did, private_key: privateKey }
		} = await Delegate.getByDid(otherDID);

		const credentials = { did, privateKey };

		return await blockchainManager.revokeDelegate(credentials, otherDID);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.DELETE);
	}
};

// retorna true si "userDID" realizo una delegacion de DID a "otherDID"
module.exports.validDelegate = async function (registerId, otherDid) {
	try {
		const { did } = await Register.getCredentials(registerId);

		return await blockchainManager.validateDelegate(did, otherDid);
	} catch (err) {
		console.log(err);
		throw Messages.DELEGATE.ERR.GET_DELEGATE;
	}
};
