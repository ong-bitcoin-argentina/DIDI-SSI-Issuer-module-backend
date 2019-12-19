const Participant = require("../models/Participant");
const Messages = require("../constants/Messages");

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

module.exports.create = async function(name, data, templateId) {
	try {
		const participant = await Participant.generate(name, data, templateId);
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
