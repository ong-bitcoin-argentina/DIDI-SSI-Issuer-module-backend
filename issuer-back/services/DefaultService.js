const DefaultValues = require("../models/DefaultValues");
const Register = require("../models/Register");
const Template = require("../models/Template");

const validate = async ({ templateId, registerId }) => {
	// Verifico si existe el template
	const template = await Template.findById(templateId);
	if (!template) return Promise.reject(Messages.REGISTER.ERR.BLOCKCHAIN);

	// Verifico si existe el registerId
	const register = await Register.findById(registerId);
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
