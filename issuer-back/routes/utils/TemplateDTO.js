const pick = require("lodash.pick");

const toDTO = templates => templates.map(template => pick(template, ["createdOn", "name", "_id"]));

module.exports = {
	toDTO
};
