const pick = require("lodash.pick");

const toDTO = templates =>
	templates.map(template => ({
		...pick(template, ["createdOn", "name", "_id"]),
		blockchain: template.registerId.did.split(":")[2]
	}));

module.exports = {
	toDTO
};
