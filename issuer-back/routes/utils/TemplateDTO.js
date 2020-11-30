const pick = require("lodash.pick");

const getRegisterId = template => {
	const register = template.registerId;
	const blockchain = register ? register.did.split(":")[2] : undefined;
	return blockchain;
};

const toDTO = templates => {
	return templates.map(template => ({
		...pick(template, ["createdOn", "name", "_id"]),
		blockchain: getRegisterId(template)
	}));
};

module.exports = {
	toDTO
};
