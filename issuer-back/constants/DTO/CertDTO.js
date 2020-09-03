const parse = cert => ({
	_id: cert._id,
	name: cert.data.cert[0].value,
	createdOn: cert.createdOn,
	revocation: cert.revocation,
	emmitedOn: cert.emmitedOn,
	firstName: cert.data.participant[0][1].value,
	lastName: cert.data.participant[0][2].value
});

module.exports.getDID = cert => cert.data.participant[0][0].value;

module.exports.toDTO = certs => certs.map(parse);
