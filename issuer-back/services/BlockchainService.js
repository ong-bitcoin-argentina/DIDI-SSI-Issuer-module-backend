const Constants = require("../constants/Constants");
const { delegateTypes } = require("ethr-did-resolver");
// const regName = delegateTypes.Secp256k1VerificationKey2018;
const regName = delegateTypes.Secp256k1SignatureAuthentication2018;
// console.log(regName);

const Messages = require("../constants/Messages");
const Register = require("../models/Register");

const DidRegistryContract = require("ethr-did-registry");
var Tx = require("ethereumjs-tx");

var Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(Constants.BLOCKCHAIN.BLOCK_CHAIN_URL);
const web3 = new Web3(provider);

const fetch = require("node-fetch");

const {
	INVALID_STATUS,
	RETRY,
	GET,
	BLOCKCHAIN,
	EDIT,
	CREATE,
	DID_EXISTS,
	STATUS,
	STATUS_NOT_VALID,
	REFRESH,
	NAME_EXIST
} = Messages.REGISTER.ERR;
const { ERROR, DONE, ERROR_RENEW, CREATING, REVOKING, REVOKED } = Constants.STATUS;
const DISALLOW_WITH_THESE = [CREATING, ERROR, REVOKED, ERROR_RENEW];

// obtiene el contrato (ethr-did-registry)
const getContract = function (credentials) {
	return new web3.eth.Contract(DidRegistryContract.abi, Constants.BLOCKCHAIN.BLOCK_CHAIN_CONTRACT, {
		from: credentials.from,
		gasLimit: 3000000
	});
};

// quita la extension "did:ethr:"
const cleanDid = function (did) {
	let cleanDid = did.split(":");
	cleanDid = cleanDid[cleanDid.length - 1];
	return cleanDid;
};

// realiza una transaccion generica a un contrato ethereum
const makeSignedTransaction = async function (bytecode, credentials) {
	const getNonce = async function (web3, senderAddress) {
		var result = await web3.eth.getTransactionCount(senderAddress, "pending");
		return result;
	};

	const getGasPrice = async function (web3) {
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

// realiza una delegacion de "userDID" a "otherDID"
module.exports.addDelegate = async function (userDID, credentials, otherDID) {
	try {
		const contract = getContract(credentials);
		const bytecode = await contract.methods
			.addDelegate(cleanDid(userDID), regName, cleanDid(otherDID), Constants.BLOCKCHAIN.DELEGATE_DURATION)
			.encodeABI();
		const result = await makeSignedTransaction(bytecode, credentials);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.DELEGATE);
	}
};

// anula la delegacion de "userDID" a "otherDID" de existir esta
module.exports.removeDelegate = async function (userDID, credentials, otherDID) {
	try {
		const contract = getContract(credentials);
		const bytecode = await contract.methods.revokeDelegate(cleanDid(userDID), regName, cleanDid(otherDID)).encodeABI();
		const result = await makeSignedTransaction(bytecode, credentials);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.DELETE);
	}
};

// retorna true si "userDID" realizo una delegacion de DID a "otherDID"
module.exports.validDelegate = async function (userDID, credentials, otherDID) {
	try {
		const contract = getContract(credentials);
		const result = await contract.methods
			.validDelegate(cleanDid(userDID), regName, cleanDid(otherDID))
			.call(credentials);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.GET);
	}
};

// modifica el nombre que mostrara el delegado
module.exports.setDelegateName = async function (issuerDID, credentials, name) {
	try {
		const contract = getContract(credentials);
		const bytecode = await contract.methods
			.setAttribute(cleanDid(issuerDID), web3.utils.fromAscii("name"), web3.utils.fromAscii(name), 99999999)
			.encodeABI();
		const result = await makeSignedTransaction(bytecode, credentials);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.SET_NAME);
	}
};

// obtiene el nombre que mostrara el delegado
module.exports.getDelegateName = async function (issuerDID) {
	try {
		// TODO: esto genera errores cuando los eventos son muchos.
		// Debe ser refactorizado.

		const did = cleanDid(issuerDID);

		// HACK TEMPORAL para que no recorra todos los eventos.
		if (did === Constants.ISSUER_SERVER_DID) return Promise.resolve(Constants.ISSUER_SERVER_NAME);

		const contract = getContract({ from: did });
		const events = await contract.getPastEvents("DIDAttributeChanged", { fromBlock: 0, toBlock: "latest" });

		const name = web3.utils.fromAscii("name");
		let res = "";
		for (let event of events) {
			if (
				event.returnValues.identity.toLowerCase() === did.toLowerCase() &&
				event.returnValues.validTo !== 0 &&
				event.returnValues.name.substring(0, name.length) === name
			) {
				res = web3.utils.toAscii(event.returnValues.value);
				console.log(res);
			}
		}
		return Promise.resolve(res);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.GET_NAME);
	}
};

// crear un nuevo registro en la blockchain
module.exports.newRegister = async function (did, key, name, token) {
	try {
		const blockchain = did.split(":")[2];

		// Verifico si la blockchain es correcta
		if (!Constants.BLOCKCHAINS.includes(blockchain)) return Promise.reject(BLOCKCHAIN);

		// Verifico que el did no exista
		const byDIDExist = await Register.getByDID(did);
		if (byDIDExist) return Promise.reject(DID_EXISTS);

		const repeatedRegister = await Register.findOne({ name, did: { $regex: blockchain, $options: "i" } });
		if (repeatedRegister) return Promise.reject(NAME_EXIST);

		// Se envia el did a Didi
		sendDidToDidi(did, name, token);

		const newRegister = await Register.generate(did, key, name);
		if (!newRegister) return Promise.reject(CREATE);
		return newRegister;
	} catch (err) {
		console.log(err);
		return Promise.reject(CREATE);
	}
};

// retorna todos los registros
module.exports.getAll = async function (filter) {
	try {
		const registers = await Register.getAll(filter);

		return Promise.resolve(registers);
	} catch (err) {
		console.log(err);
		return Promise.reject(GET);
	}
};

module.exports.editRegister = async function (did, body) {
	try {
		const register = await Register.getByDID(did);
		if (!register) return Promise.reject(GET);

		const { status, name } = body;
		if (status && !Constants.STATUS_ALLOWED.includes(status)) return Promise.reject(STATUS);

		if (name) await sendEditNameToDidi(did, name);

		return await register.edit(body);
	} catch (err) {
		console.log(err);
		return Promise.reject(EDIT);
	}
};

module.exports.retryRegister = async function (did, token) {
	try {
		const register = await Register.getByDID(did);

		// Verifico que exista el Register
		if (!register) return Promise.reject(GET);

		const { name, status } = register;

		// Verifico que el registro este en estado Error
		if (status !== ERROR) return Promise.reject(INVALID_STATUS);

		// Se envia a DIDI
		sendDidToDidi(did, name, token);

		// Modifico el estado a Pendiente
		await register.edit({ status: CREATING, messageError: "" });

		return register;
	} catch (err) {
		console.log(err);
		return Promise.reject(RETRY);
	}
};

module.exports.refreshRegister = async function (did, token) {
	try {
		const register = await Register.getByDID(did);

		// Verifico que exista el Register
		if (!register) return Promise.reject(GET);

		const { status } = register;
		if (DISALLOW_WITH_THESE.includes(status)) return Promise.reject(STATUS_NOT_VALID);

		// Se envia a DIDI
		sendRefreshToDidi(did, token);

		// Modifico el estado a Pendiente
		await register.edit({ status: CREATING, blockHash: "", messageError: "", expireOn: undefined });

		return register;
	} catch (err) {
		console.log(err);
		return Promise.reject(REFRESH);
	}
};

module.exports.revoke = async function (did, token) {
	try {
		const register = await Register.getByDID(did);

		// Verifico que exista el Register
		if (!register) throw GET;

		// Verifico que tenga un estado valido
		const { status } = register;
		if (DISALLOW_WITH_THESE.includes(status)) throw STATUS_NOT_VALID;

		// Se envia el revoke a DIDI
		sendRevokeToDidi(did, token);

		// Modifico el estado a Revocando
		await register.edit({ status: REVOKING, messageError: "" });

		return register;
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
};

const sendRevokeToDidi = async function (did, token) {
	return await defaultFetch(`${Constants.DIDI_API}/issuer`, "DELETE", {
		token,
		did,
		callbackUrl: `${Constants.ISSUER_API_URL}/register`
	});
};

const sendRefreshToDidi = async function (did, token) {
	return await defaultFetch(`${Constants.DIDI_API}/issuer/${did}/refresh`, "POST", {
		token,
		callbackUrl: `${Constants.ISSUER_API_URL}/register`
	});
};

const sendEditNameToDidi = async function (did, name) {
	return await defaultFetch(`${Constants.DIDI_API}/issuer/${did}`, "PUT", { name });
};

const sendDidToDidi = async function (did, name, token) {
	return await defaultFetch(`${Constants.DIDI_API}/issuer`, "POST", {
		did,
		name,
		token,
		callbackUrl: `${Constants.ISSUER_API_URL}/register`
	});
};

const defaultFetch = async function (url, method, body) {
	try {
		const response = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});

		const jsonResp = await response.json();
		if (jsonResp.status === "error") throw jsonResp;

		return jsonResp.data;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
