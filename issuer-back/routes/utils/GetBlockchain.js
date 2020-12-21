const { BLOCK_CHAIN_DEFAULT } = require("../../constants/Constants");

const getBlockchainName = register => {
	const split = register ? register.did.split(":") : undefined;
	return register && split.length === 4 ? split[2] : BLOCK_CHAIN_DEFAULT;
};

module.exports = {
	getBlockchainName
};
