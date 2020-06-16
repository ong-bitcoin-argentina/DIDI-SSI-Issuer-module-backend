const Constants = require("./Constants");

module.exports = {
    PARTICIPANT_NEW: [
		{
			name: "token",
			validate: [Constants.VALIDATION_TYPES.IS_ADMIN],
			isHead: true
		},
		{
			name: "data",
			validate: [Constants.VALIDATION_TYPES.IS_NEW_PARTICIPANTS_DATA]
		}
	],
}