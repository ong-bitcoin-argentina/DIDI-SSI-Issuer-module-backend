/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const ClaimsData = require("./dataTypes/ClaimsData");
const { CERT_CATEGORIES } = require("../constants/Constants");
const Messages = require("../constants/Messages");

//toDo:check if we have to save other properties
const ShareResponseSchema = mongoose.Schema({
	req: {
		type: String,
		require: true
	},
	vc: {
		verifiable: {
			type: Object,
			of: ClaimsData
		}
	},
	createdOn: {
		type: Date,
		default: Date.now()
	}
});

const ShareResponse = mongoose.model("ShareResponse", ShareResponseSchema);
module.exports = ShareResponse;

ShareResponse.generate = async function generate(req, vc) {
	let shareResponse = new ShareResponse();
	shareResponse.vc = [];

	try {
		//toDo: validate vc keys
		shareResponse = await shareResponse.save();

		return Promise.resolve(shareResponse);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

ShareResponse.getById = async function getById(id) {
	try {
		const query = { _id: id };
		const shareResponse = await ShareResponse.findOne(query);
		//toDo:Add exception if share resp does not exist
		// if (!shareResponse) throw Messages.SHARE_REQ.ERR.NOT_EXIST;

		return Promise.resolve(shareResponse);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
