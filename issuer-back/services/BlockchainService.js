const Constants = require("../constants/Constants");
const { delegateTypes } = require("ethr-did-resolver");
// const regName = delegateTypes.Secp256k1VerificationKey2018;
const regName = delegateTypes.Secp256k1SignatureAuthentication2018;
// console.log(regName);

const DidRegistryContract = require("ethr-did-registry");
var Tx = require("ethereumjs-tx");

var Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(Constants.BLOCKCHAIN.RSK_URL);
const web3 = new Web3(provider);

const getContract = function(credentials) {
	return new web3.eth.Contract(DidRegistryContract.abi, Constants.BLOCKCHAIN.BLOCK_CHAIN_CONTRACT, {
		from: credentials.from,
		gasLimit: 3000000
	});
};

const makeSignedTransaction = async function(bytecode, credentials) {
	const getNonce = async function(web3, senderAddress) {
		var result = await web3.eth.getTransactionCount(senderAddress, "pending");
		return result;
	};

	const getGasPrice = async function(web3) {
		var block = await web3.eth.getBlock("latest");
		if (block.minimumGasPrice <= 21000) {
			return 21000;
		} else {
			return parseInt(block.minimumGasPrice);
		}
	};

	const rawTx = {
		nonce: await getNonce(web3, credentials.from),
		gasPrice: await getGasPrice(web3),
		gas: await web3.eth.estimateGas({
			to: Constants.BLOCKCHAIN.BLOCK_CHAIN_CONTRACT,
			from: credentials.from,
			data: bytecode
		}),
		data: bytecode,
		to: Constants.BLOCKCHAIN.BLOCK_CHAIN_CONTRACT
	};

	if (Constants.DEBUGG) console.log(rawTx);

	var tx = new Tx(rawTx);
	tx.sign(Buffer.from(credentials.key, "hex"));
	var serializedTx = tx.serialize();
	const res = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
	return res;
};

module.exports.addDelegate = async function(userDID, credentials, otherDID) {
	const contract = getContract(credentials);
	const bytecode = await contract.methods
		.addDelegate(userDID, regName, otherDID, Constants.BLOCKCHAIN.DELEGATE_DURATION)
		.encodeABI();
	const result = await makeSignedTransaction(bytecode, credentials, otherDID);
	return result;
};

module.exports.removeDelegate = async function(userDID, credentials, otherDID) {
	const contract = getContract(credentials);
	const bytecode = await contract.methods.revokeDelegate(userDID, regName, otherDID).encodeABI();
	const result = await makeSignedTransaction(bytecode, credentials, otherDID);
	return result;
};

module.exports.validDelegate = async function(userDID, credentials, otherDID) {
	const contract = getContract(credentials);
	const result = await contract.methods.validDelegate(userDID, regName, otherDID).call(credentials);
	return result;
};
