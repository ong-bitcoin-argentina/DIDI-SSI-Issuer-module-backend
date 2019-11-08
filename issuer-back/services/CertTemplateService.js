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
	try {
		let template = await getById(id);
		template = await template.rename(name);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

module.exports.addCertData = async function(id, certData) {
	try {
		let template = await getById(id);
		template = await template.addCertData(certData);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

module.exports.addParticipantData = async function(id, partData) {
	try {
		let template = await getById(id);
		template = await template.addParticipantData(partData);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

module.exports.addOthersData = async function(id, othersData) {
	try {
		let template = await getById(id);
		template = await template.addOthersData(othersData);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

module.exports.deleteCertData = async function(id, certData) {
	try {
		let template = await getById(id);
		template = await template.deleteCertData(certData);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

module.exports.deleteParticipantData = async function(id, partData) {
	try {
		let template = await getById(id);
		template = await template.deleteParticipantData(partData);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

module.exports.deleteOthersData = async function(id, othersData) {
	try {
		let template = await getById(id);
		template = await template.deleteOthersData(othersData);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
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
