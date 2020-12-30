const Template = require("../models/Template");
const Messages = require("../constants/Messages");
const Register = require("../models/Register");

// obtener el modelo de certificado a correspondiente a ese id
var getById = async function (id) {
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
module.exports.getAll = async function () {
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
module.exports.create = async function (name, registerId) {
	try {
		// Verifico que el registro exista
		const register = await Register.getById(registerId);
		if (!register) return Promise.reject(Messages.REGISTER.ERR.GET);

		const template = await Template.findOne({ name });
		if (template) return Promise.reject(Messages.TEMPLATE.ERR.UNIQUE_NAME);

		return await Template.generate(name, registerId);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.CREATE);
	}
};

// modifica el modelo de certificado
module.exports.edit = async function (id, data, previewData, previewType, category, registerId) {
	try {
		let template = await getById(id);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.GET);

		// Verifico que el registro exista
		const register = await Register.getById(registerId);
		if (!register) return Promise.reject(Messages.REGISTER.ERR.GET);

		template = await template.edit(data, previewData, previewType, category, registerId);
		if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
		return Promise.resolve(template);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
	}
};

// marca el modelo de certificado como borrado
module.exports.delete = async function (id) {
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
