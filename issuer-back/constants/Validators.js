const Constants = require("./Constants");

const { IS_STRING, IS_NEW_PARTICIPANTS_DATA } = Constants.VALIDATION_TYPES;
const { Admin, Delete_Certs, Write_Certs, Read_Certs } = Constants.USER_TYPES;

const TOKEN_PROPS_VALIDATION = {
	name: "token",
	validate: [],
	isHead: true
};

const TOKEN_VALIDATION = {
	Admin: { ...TOKEN_PROPS_VALIDATION, validate: [Admin] },
	Delete_Certs: { ...TOKEN_PROPS_VALIDATION, validate: [Delete_Certs] },
	Write_Certs: { ...TOKEN_PROPS_VALIDATION, validate: [Write_Certs] },
	Read_Certs: { ...TOKEN_PROPS_VALIDATION, validate: [Read_Certs] }
};

module.exports = {
	TOKEN_VALIDATION,
	PARTICIPANT_NEW: [
		TOKEN_VALIDATION.Write_Certs,
		{
			name: "data",
			validate: [IS_NEW_PARTICIPANTS_DATA]
		}
	],
	CERT_REVOCATION: [
		TOKEN_VALIDATION.Delete_Certs,
		{
			name: "revokeReason",
			validate: [IS_STRING],
			optional: true
		}
	]
};
