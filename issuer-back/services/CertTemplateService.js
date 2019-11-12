const CertTemplate = require("../models/CertTemplate");
const Messages = require("../constants/Messages");

var getById = async function(id) {
	try {
		let template = await CertTemplate.getById(id);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.GET);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.GET);
	}
};
module.exports.getById = getById;

var _getAndEdit = async function(id, data, editMethod, defaultValue) {
	try {
		let template = await getById(id);
		template = await template[editMethod](data, defaultValue);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

module.exports.getAll = async function() {
	try {
		let templates = await CertTemplate.getAll();
		if (!templates) return Promise.reject(Messages.TEMPLATE.ERR.GET);
		return Promise.resolve(templates);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.GET);
	}
};

module.exports.create = async function(name, certData, participantData, othersData) {
	try {
		const template = await CertTemplate.generate(name, certData, participantData, othersData);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.CREATE);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.CREATE);
	}
};

module.exports.rename = async function(id, name) {
	return await _getAndEdit(id, name, "rename");
};

module.exports.addCertData = async function(id, certData) {
	return await _getAndEdit(id, certData, "addCertData");
};

module.exports.addParticipantData = async function(id, partData) {
	return await _getAndEdit(id, partData, "addParticipantData");
};

module.exports.addOthersData = async function(id, othersData) {
	return await _getAndEdit(id, othersData, "addOthersData");
};

module.exports.toggleRequiredForCertData = async function(id, data) {
	return await _getAndEdit(id, data, "toggleRequiredCertData");
};

module.exports.toggleRequiredForParticipantData = async function(id, data) {
	return await _getAndEdit(id, data, "toggleRequiredForParticipantData");
};

module.exports.toggleRequiredForOthersData = async function(id, data) {
	return await _getAndEdit(id, data, "toggleRequiredForOthersData");
};

module.exports.setDefaultForCertData = async function(id, data, defaultValue) {
	return await _getAndEdit(id, data, "setDefaultForCertData", defaultValue);
};

module.exports.setDefaultForParticipantData = async function(id, data, defaultValue) {
	return await _getAndEdit(id, data, "setDefaultForParticipantData", defaultValue);
};

module.exports.setDefaultForOthersData = async function(id, data, defaultValue) {
	return await _getAndEdit(id, data, "setDefaultForOthersData", defaultValue);
};

module.exports.deleteCertData = async function(id, certData) {
	return await _getAndEdit(id, certData, "deleteCertData");
};

module.exports.deleteParticipantData = async function(id, partData) {
	return await _getAndEdit(id, partData, "deleteParticipantData");
};

module.exports.deleteOthersData = async function(id, othersData) {
	return await _getAndEdit(id, othersData, "deleteOthersData");
};

module.exports.delete = async function(id) {
	try {
		let template = await getById(id);
		template = await template.delete();
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.DELETE);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.DELETE);
	}
};
