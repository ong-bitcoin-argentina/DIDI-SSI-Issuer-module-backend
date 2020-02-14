const Template = require("../models/Template");
const Messages = require("../constants/Messages");

// obtener el modelo de certificado a correspondiente a ese id
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

// retorna todos los modelos de certificados
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

// genera un nuevo modelo de certificado
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

// modifica el modelo de certificado
module.exports.edit = async function(id, data, previewData, previewType, category) {
	try {
		let template = await getById(id);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.GET);
		template = await template.edit(data, previewData, previewType, category);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

// marca el modelo de certificado como borrado
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
