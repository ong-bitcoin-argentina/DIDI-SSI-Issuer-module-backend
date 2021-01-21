const fetch = require("node-fetch");
const Messages = require("../constants/Messages");
const Register = require("../models/Register");
const Constants = require("../constants/Constants");
const { Resolver } = require("did-resolver");
const { SimpleSigner, createJWT, verifyJWT } = require("did-jwt");
const { getResolver } = require("ethr-did-resolver");

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
	NAME_EXIST,
	INVALID_DID,
	INVALID_PRIVATE_KEY
} = Messages.REGISTER.ERR;
const { ERROR, DONE, ERROR_RENEW, CREATING, REVOKING, REVOKED } = Constants.STATUS;
const DISALLOW_WITH_THESE = [CREATING, ERROR, REVOKED, ERROR_RENEW];

const resolver = new Resolver(getResolver(Constants.BLOCKCHAIN.PROVIDER_CONFIG));

const CODES = {
	"Not a valid ethr DID": INVALID_DID,
	"Signature invalid for JWT": INVALID_PRIVATE_KEY
};

const validateDidAndKey = async (did, key) => {
	try {
		const signer = SimpleSigner(key);
		const jwt = await createJWT({}, { alg: "ES256K-R", issuer: did, signer });

		const options = {
			resolver
		};

		await verifyJWT(jwt, options);
	} catch (error) {
		const { message } = error;
		console.log(message);

		throw CODES[message.split(":")[0]];
	}
};

// crear un nuevo registro en la blockchain
module.exports.newRegister = async function (did, key, name, token) {
	try {
		const blockchain = did.split(":")[2];

		// Verifico si esta bien creado el did y la key
		await validateDidAndKey(did, key);

		// Verifico si la blockchain es correcta
		if (!Constants.BLOCKCHAINS.includes(blockchain)) throw BLOCKCHAIN;

		// Verifico que el did no exista
		const byDIDExist = await Register.getByDID(did);
		if (byDIDExist) throw DID_EXISTS;

		// Verifico que no exista el nombre en una misma blockchain
		const repeatedRegister = await Register.findOne({ name, did: { $regex: blockchain, $options: "i" } });
		if (repeatedRegister) throw NAME_EXIST;

		// Se envia el did a Didi
		sendDidToDidi(did, name, token);

		const newRegister = await Register.generate(did, key, name);
		if (!newRegister) throw CREATE;

		return newRegister;
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
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
