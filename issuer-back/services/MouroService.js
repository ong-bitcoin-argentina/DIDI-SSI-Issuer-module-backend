const Constants = require("../constants/Constants");
const Messages = require("../constants/Messages");

const EthrDID = require("ethr-did");
const { createVerifiableCredential } = require("did-jwt-vc");

const fetch = require("node-fetch");

// genera un certificado asociando la informaciòn recibida en "subject" con el did
module.exports.createCertificate = async function(subject, did) {
	const vcissuer = new EthrDID({
		address: Constants.SERVER_DID,
		privateKey: Constants.SERVER_PRIVATE_KEY
	});

	const vcPayload = {
		sub: did,
		nbf: Constants.NOT_BACK_FROM,
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
	fetch(Constants.DIDI_API + "/issuer/issueCertificate", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			did: "did:ethr:" + Constants.SERVER_DID,
			jwt: cert
		})
	})
		.then(response => {
			return response.json();
		})
		.catch(err => {
			console.log(err);
		});
};