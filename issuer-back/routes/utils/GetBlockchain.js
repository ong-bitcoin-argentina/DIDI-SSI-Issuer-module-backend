const Constants = require("../../constants/Constants");
const { BLOCK_CHAIN_DEFAULT } = require("../../constants/Constants");

const getBlockchainName = register => {
	let blockchain_ = BLOCK_CHAIN_DEFAULT;
	if (register) {
		const split = register.did.split(":");
		const blockchain = split[2];
		if (Constants.BLOCKCHAINS.includes(blockchain)) blockchain_ = blockchain;
	}
	return blockchain_;
};

module.exports = {
	getBlockchainName
};
