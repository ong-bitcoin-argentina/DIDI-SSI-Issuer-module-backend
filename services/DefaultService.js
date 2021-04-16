const DefaultValues = require("../models/DefaultValues");
const Register = require("../models/Register");
const Template = require("../models/Template");
const sanitize = require("mongo-sanitize");

const validate = async ({ templateId, registerId }) => {
	// Verifico si existe el template
	const cleanedTemplateId = sanitize(templateId);
	const template = await Template.findById(cleanedTemplateId);
	if (!template) return Promise.reject(Messages.REGISTER.ERR.BLOCKCHAIN);

	// Verifico si existe el registerId
	const cleanedRegisterId = sanitize(registerId);
	const register = await Register.findById(cleanedRegisterId);
	if (!register) return Promise.reject(Messages.REGISTER.ERR.BLOCKCHAIN);
};

// crear un nuevo default
module.exports.newDefault = async function (body) {
	try {
		validate(body);

		// Verifico que no exista un default
		const default_ = await DefaultValues.get();
		if (default_) return Promise.reject(Messages.REGISTER.ERR.BLOCKCHAIN);

		return DefaultValues.generate(body);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.REGISTER.ERR.CREATE);
	}
};

// retorna todos el default
module.exports.get = async function () {
	try {
		return await DefaultValues.get();
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.REGISTER.ERR.GET);
	}
};

// edita el default
module.exports.editDefault = async function (body) {
	try {
		validate(body);

		// Verifico que no exista un default
		const default_ = await DefaultValues.get();
		if (!default_) return Promise.reject(Messages.REGISTER.ERR.BLOCKCHAIN);

		return default_.edit(body);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.REGISTER.ERR.CREATE);
	}
};
