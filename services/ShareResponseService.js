/* eslint-disable no-console */
const ShareResponse = require("../models/ShareResponse");

const { missingId, missingName, missingClaims } = require("../constants/serviceErrors");

module.exports.create = async (vc, req) => {
	//Todo:throw exceptions if vc or req not exists
	// if (!vc) throw missingName;
	// if (!req) throw missingClaims;
	try {
		return ShareResponse.generate(vc, req);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};

module.exports.getById = async id => {
	if (!id) throw missingId;
	try {
		return ShareResponse.getById(id);
	} catch (err) {
		console.log(err);
		return Promise.reject(err);
	}
};
