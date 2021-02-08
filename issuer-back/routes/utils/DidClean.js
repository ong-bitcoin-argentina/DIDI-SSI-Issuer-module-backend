// Se utiliza para obtener el did limpio y el nombre la blockchain que este asignado, ejemplo did:ethr:rsk:323...

const getCleanedDid = did => {
	const didSplit = did.split(":");
	const cleanDid = didSplit.slice(-1)[0];
	const blockchain = didSplit[2];

	return { cleanDid, blockchain };
};

module.exports = {
	getCleanedDid
};
