const getDidClean = did => {
	const didSplit = did.split(":");
	const cleanDid = didSplit.slice(-1)[0];
	const blockchain = didSplit[2];

	return { cleanDid, blockchain };
};

module.exports = {
	getDidClean
};
