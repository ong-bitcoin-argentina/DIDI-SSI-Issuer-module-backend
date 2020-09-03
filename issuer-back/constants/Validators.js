const Constants = require("./Constants");
const { IS_ADMIN, IS_STRING, IS_NEW_PARTICIPANTS_DATA } = Constants.VALIDATION_TYPES;
const TOKEN_VALIDATION = {
	name: "token",
	validate: [IS_ADMIN],
	isHead: true
};

module.exports = {
	TOKEN_VALIDATION,
	PARTICIPANT_NEW: [
		TOKEN_VALIDATION,
		{
			name: "data",
			validate: [IS_NEW_PARTICIPANTS_DATA]
		}
	],
	CERT_REVOCATION: [
		TOKEN_VALIDATION,
		{
			name: "revokeReason",
			validate: [IS_STRING],
			optional: true
		}
	]
};
