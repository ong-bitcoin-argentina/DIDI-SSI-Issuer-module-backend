const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const EthrDID = require("ethr-did");
const { createVerifiableCredential } = require("did-jwt-vc");
const didJWT = require("did-jwt");
const fetch = require("node-fetch");

const { Credentials } = require("uport-credentials");

const { Resolver } = require("did-resolver");
const { getResolver } = require("ethr-did-resolver");
const resolver = new Resolver(getResolver());

module.exports.verifyCertificate = async function(jwt, issuerDid, errMsg) {
	try {
		let result = await verifyCredential(jwt, resolver);

		console.log("cred: ");
		console.log(result);

		if (result.payload.iss === issuerDid) {
			console.log(Messages.CERTIFICATE.VERIFIED);
			return Promise.resolve(result);
		}

		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(errMsg);
	}
};

module.exports.createShareRequest = async function(callback, requested) {
	const signer = didJWT.SimpleSigner(Constants.ISSUER_SERVER_PRIVATE_KEY);
	const credentials = new Credentials({ did: "did:ethr:" + Constants.ISSUER_SERVER_DID, signer });

	try {
		let result = await credentials.createDisclosureRequest({ callbackUrl: callback, requested: requested });
		if (Constants.DEBUGG) console.log(result);
		return Promise.resolve(result);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

// genera un certificado asociando la informaciòn recibida en "subject" con el did
module.exports.createCertificate = async function(subject, expDate, did) {
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
module.exports.saveCertificate = async function(cert) {
	try {
		var response = await fetch(Constants.DIDI_API + "/issuer/issueCertificate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				did: "did:ethr:" + Constants.ISSUER_SERVER_DID,
				jwt: cert
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
module.exports.revokeCertificate = async function(hash, sub) {
	try {
		var response = await fetch(Constants.DIDI_API + "/issuer/revokeCertificate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				did: "did:ethr:" + Constants.ISSUER_SERVER_DID,
				sub: sub,
				hash: hash
			})
		});
		return Promise.resolve(response.json());
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
