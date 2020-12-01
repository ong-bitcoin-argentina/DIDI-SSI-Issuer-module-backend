const toDTO = register => ({
	_id: register._id,
	did: register.did,
	name: register.name,
	expireOn: register.expireOn,
	createdOn: register.createdOn,
	status: register.status,
	blockHash: register.blockHash
});

module.exports = {
	toDTO
};
