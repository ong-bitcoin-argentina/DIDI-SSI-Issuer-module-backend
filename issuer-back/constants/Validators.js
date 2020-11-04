const Constants = require("./Constants");

const { IS_ADMIN, IS_MANAGER, IS_OBSERVER, IS_STRING, IS_NEW_PARTICIPANTS_DATA } = Constants.VALIDATION_TYPES;

const TOKEN_PROPS_VALIDATION = {
	name: "token",
	validate: [],
	isHead: true
};

const TOKEN_VALIDATION = {
	Admin: { ...TOKEN_PROPS_VALIDATION, validate: [IS_ADMIN] },
	Manager: { ...TOKEN_PROPS_VALIDATION, validate: [IS_MANAGER] },
	Observer: { ...TOKEN_PROPS_VALIDATION, validate: [IS_OBSERVER] }
};

module.exports = {
	TOKEN_VALIDATION,
	PARTICIPANT_NEW: [
		TOKEN_VALIDATION.Manager,
		{
			name: "data",
			validate: [IS_NEW_PARTICIPANTS_DATA]
		}
	],
	CERT_REVOCATION: [
		TOKEN_VALIDATION.Manager,
		{
			name: "revokeReason",
			validate: [IS_STRING],
			optional: true
		}
	]
};
