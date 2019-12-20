const Template = require("../models/Template");
const Messages = require("../constants/Messages");

var getById = async function(id) {
	try {
		let template = await Template.getById(id);
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
		let templates = await Template.getAll();
		if (!templates) return Promise.reject(Messages.TEMPLATE.ERR.GET);
		return Promise.resolve(templates);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.GET);
	}
};

module.exports.create = async function(name) {
	try {
		const template = await Template.generate(name);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.CREATE);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.CREATE);
	}
};

module.exports.edit = async function(id, data, previewData, previewType) {
	try {
		let template = await getById(id);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.GET);
		template = await template.edit(data, previewData, previewType);
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
