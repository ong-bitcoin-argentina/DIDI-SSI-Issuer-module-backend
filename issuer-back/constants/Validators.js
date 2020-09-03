const Constants = require("./Constants");
const { IS_ADMIN, IS_STRING, IS_NEW_PARTICIPANTS_DATA } = Constants.VALIDATION_TYPES;

module.exports = {
	PARTICIPANT_NEW: [
		{
			name: "token",
			validate: [IS_ADMIN],
			isHead: true
		},
		{
			name: "data",
			validate: [IS_NEW_PARTICIPANTS_DATA]
		}
	],
	CERT_REVOCATION: [
		{
			name: "token",
			validate: [IS_ADMIN],
			isHead: true
		},
		{
			name: "revokeReason",
			validate: [IS_STRING],
			optional: true
		}
	]
};
