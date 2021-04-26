const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const EthrDID = require("ethr-did");
const { createVerifiableCredential } = require("did-jwt-vc");
const { decodeJWT, SimpleSigner } = require("did-jwt");
const fetch = require("node-fetch");

const { Credentials } = require("uport-credentials");

const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");
const Register = require("../models/Register");
const resolver = new Resolver(
	getResolver({ rpcUrl: Constants.BLOCKCHAIN.URL, registry: Constants.BLOCKCHAIN.CONTRACT })
);

// decodifica el certificado, retornando la info (independientemente de si el certificado es valido o no)
module.exports.decodeCertificate = async function (jwt, errMsg) {
	try {
		let result = await decodeJWT(jwt);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

// genera un certificado con un pedido de informacion (certificado o informacion de certificado),
// la cual esta especificada en "claims", si el usuario accede, se ejecuta una llamada a "cb" con el resultado en el body contenido en "access_token"
module.exports.createShareRequest = async function (claims, cb, registerId) {
	try {
		const exp = ((new Date().getTime() + 600000) / 1000) | 0;

		const payload = {
			exp: exp,
			delegator: Constants.ISSUER_DELEGATOR_DID ? "did:ethr:" + Constants.ISSUER_DELEGATOR_DID : undefined,
			callback: cb,
			claims: claims,
			type: "shareReq"
		};
		const { did, key } = await Register.getCredentials(registerId);

		const signer = SimpleSigner(key);
		const credentials = new Credentials({ did, signer, resolver });
		const result = await credentials.signJWT(payload);
		if (Constants.DEBUGG) console.log(result);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SHARE_REQ.ERR.CREATE);
	}
};

// genera un certificado asociando la información recibida en "subject" con el did
module.exports.createCertificate = async function (subject, expDate, did, template) {
	const { registerId } = template;

	if (!registerId) return Promise.reject(Messages.REGISTER.ERR.NOT_BLOCKCHAIN);

	const { did: registerDid, key } = await Register.getCredentials(registerId);

	const cleanDid = registerDid.split(":");
	const prefixedDid = cleanDid.slice(2).join(":");

	const vcissuer = new EthrDID({
		address: prefixedDid,
		privateKey: key
	});

	const date = expDate ? (new Date(expDate).getTime() / 1000) | 0 : undefined;

	const vcPayload = {
		sub: did,
		exp: date,
		vc: {
			"@context": [Constants.CREDENTIALS.CONTEXT],
			type: [Constants.CREDENTIALS.TYPES.VERIFIABLE],
			credentialSubject: subject
		}
	};

	if (Constants.ISSUER_DELEGATOR_DID) vcPayload["delegator"] = "did:ethr:" + Constants.ISSUER_DELEGATOR_DID;

	try {
		let result = await createVerifiableCredential(vcPayload, vcissuer);
		if (Constants.DEBUGG) console.log(result);
		console.log(Messages.CERTIFICATE.CREATED);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// recibe el caertificado y lo envia a didi-server para ser guardado
module.exports.saveCertificate = async function (cert, sendPush, registerId) {
	try {
		const { did } = await Register.getCredentials(registerId);

		const response = await fetch(Constants.DIDI_API + "/issuer/issueCertificate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				did,
				jwt: cert,
				sendPush: sendPush
			})
		});

		const jsonResp = await response.json();
		return jsonResp.status === "error" ? Promise.reject(jsonResp) : Promise.resolve(jsonResp.data);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// recibe el caertificado y lo envia a didi-server para ser borrado
module.exports.revokeCertificate = async function (jwt, hash, sub, registerId) {
	try {
		const { did } = await Register.getCredentials(registerId);

		const response = await fetch(Constants.DIDI_API + "/issuer/revokeCertificate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				did,
				sub: sub,
				jwt: jwt,
				hash: hash
			})
		});
		return Promise.resolve(response.json());
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// recibe el pedido y lo envia a didi-server para ser enviado al usuario
module.exports.sendShareRequest = async function (did, cert, registerId) {
	try {
		const exp = ((new Date().getTime() + 600000) / 1000) | 0;
		const { did } = await Register.getCredentials(registerId);

		const payload = {
			issuerDid: did,
			exp: exp,
			did: did,
			jwt: cert
		};
		if (Constants.ISSUER_DELEGATOR_DID) payload["delegatorDid"] = "did:ethr:" + Constants.ISSUER_DELEGATOR_DID;

		const response = await fetch(Constants.DIDI_API + "/issuer/issueShareRequest", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});

		const jsonResp = await response.json();
		return jsonResp.status === "error" ? Promise.reject(jsonResp) : Promise.resolve(jsonResp.data);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SHARE_REQ.ERR.SEND);
	}
};

module.exports.getSkeletonForEmmit = function (template, wrapped = false) {
	let result = {
		category: Constants.CERT_CATEGORY_MAPPING[template.category],
		preview: {
			type: Number(template.previewType),
			fields: template.previewData,
			cardLayout: template.cardLayout
		},
		data: {}
	};
	if (wrapped) {
		result.wrapped = {};
	}
	return result;
};
