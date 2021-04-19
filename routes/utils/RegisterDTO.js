const { getBlockchainName } = require("./GetBlockchain");

const toDTO = register => {
	const blockchain = getBlockchainName(register);

	return {
		_id: register._id,
		did: register.did,
		name: register.name,
		expireOn: register.expireOn,
		createdOn: register.createdOn,
		status: register.status,
		messageError: register.messageError,
		blockHash: register.blockHash,
		blockchain
	};
};

module.exports = {
	toDTO
};
