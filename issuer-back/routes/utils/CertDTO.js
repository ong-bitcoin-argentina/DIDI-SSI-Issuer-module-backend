const parse = cert => {
	const register = cert.templateId ? cert.templateId.registerId : undefined;
	const blockchain = register ? register.did.split(":")[2] : undefined;
	return {
		_id: cert._id,
		name: cert.data.cert[0].value,
		did: getDID(cert),
		createdOn: cert.createdOn,
		revocation: cert.revocation,
		emmitedOn: cert.emmitedOn,
		firstName: cert.data.participant[0][1].value,
		lastName: cert.data.participant[0][2].value,
		blockchain
	};
};
const getDID = cert => cert.data.participant[0][0].value;

const toDTO = certs => certs.map(parse);

module.exports = {
	toDTO,
	getDID
};
