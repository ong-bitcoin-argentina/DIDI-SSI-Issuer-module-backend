const Participant = require("../models/Participant");
const Messages = require("../constants/Messages");

var getByDid = async function(did) {
	try {
		let participant = await Participant.getByDid(did);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};
module.exports.getByDid = getByDid;

var getById = async function(id) {
	try {
		let participant = await Participant.getById(id);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};
module.exports.getById = getById;

module.exports.getAllByTemplateId = async function(templateId) {
	try {
		let participants = await Participant.getAllByTemplateId(templateId);
		return Promise.resolve(participants);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};

module.exports.getAllDids = async function() {
	try {
		let participants = await Participant.getAllDids();
		return Promise.resolve(participants);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};

module.exports.getByRequestCode = async function(requestCode) {
	try {
		let participant = await Participant.getByRequestCode(requestCode);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};

module.exports.create = async function(name, did, data, templateId, code) {
	try {
		const participant = await Participant.generate(name, did, data, templateId, code);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.CREATE);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.CREATE);
	}
};

module.exports.edit = async function(id, name, data) {
	try {
		let participant = await getById(id);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
		participant = await participant.edit(name, data);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.EDIT);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.EDIT);
	}
};

module.exports.delete = async function(id) {
	try {
		let participant = await getById(id);
		participant = await participant.delete();
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.DELETE);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.DELETE);
	}
};
