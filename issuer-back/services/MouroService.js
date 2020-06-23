const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const EthrDID = require("ethr-did");
const { createVerifiableCredential } = require("did-jwt-vc");
const { verifyJWT, decodeJWT, SimpleSigner } = require("did-jwt");
const fetch = require("node-fetch");

const { Credentials } = require("uport-credentials");

const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");
const resolver = new Resolver(
	getResolver({ rpcUrl: Constants.BLOCKCHAIN.BLOCK_CHAIN_URL, registry: Constants.BLOCKCHAIN.BLOCK_CHAIN_CONTRACT })
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

// analiza la validez del certificado
module.exports.verifyCertificate = async function (jwt, errMsg) {
	try {
		let result = await verifyJWT(jwt, { resolver: resolver, audience: "did:ethr:" + Constants.ISSUER_SERVER_DID });
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

// genera un certificado con un pedido de informacion (certificado o informacion de certificado),
// la cual esta especificada en "claims", si el usuario accede, se ejecuta una llamada a "cb" con el resultado en el body contenido en "access_token"
module.exports.createShareRequest = async function (claims, cb) {
	try {
		const exp = ((new Date().getTime() + 600000) / 1000) | 0;

		const payload = {
			exp: exp,
			delegator: Constants.ISSUER_DELEGATOR_DID ? "did:ethr:" + Constants.ISSUER_DELEGATOR_DID : undefined,
			callback: cb,
			claims: claims,
			type: "shareReq"
		};
		const signer = SimpleSigner(Constants.ISSUER_SERVER_PRIVATE_KEY);
		const credentials = new Credentials({ did: "did:ethr:" + Constants.ISSUER_SERVER_DID, signer, resolver });
		const result = await credentials.signJWT(payload);
		if (Constants.DEBUGG) console.log(result);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.SHARE_REQ.ERR.CREATE);
	}
};

// genera un certificado asociando la información recibida en "subject" con el did
module.exports.createCertificate = async function (subject, expDate, did) {
	const vcissuer = new EthrDID({
		address: Constants.ISSUER_SERVER_DID,
		privateKey: Constants.ISSUER_SERVER_PRIVATE_KEY
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
module.exports.saveCertificate = async function (cert, sendPush) {
	try {
		var response = await fetch(Constants.DIDI_API + "/issuer/issueCertificate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				did: "did:ethr:" + Constants.ISSUER_SERVER_DID,
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
module.exports.revokeCertificate = async function (jwt, hash, sub) {
	try {
		var response = await fetch(Constants.DIDI_API + "/issuer/revokeCertificate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				did: "did:ethr:" + Constants.ISSUER_SERVER_DID,
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
module.exports.sendShareRequest = async function (did, cert) {
	try {
		const exp = ((new Date().getTime() + 600000) / 1000) | 0;

		const payload = {
			issuerDid: "did:ethr:" + Constants.ISSUER_SERVER_DID,
			exp: exp,
			did: did,
			jwt: cert
		};
		if (Constants.ISSUER_DELEGATOR_DID) payload["delegatorDid"] = "did:ethr:" + Constants.ISSUER_DELEGATOR_DID;

		var response = await fetch(Constants.DIDI_API + "/issuer/issueShareRequest", {
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
