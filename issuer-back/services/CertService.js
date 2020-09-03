const Cert = require("../models/Cert");
const Messages = require("../constants/Messages");
const { toDTO } = require("../constants/DTO/CertDTO");

var getById = async function (id) {
	try {
		let cert = await Cert.getById(id);
		if (!cert) return Promise.reject(Messages.CERT.ERR.GET);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.GET);
	}
};
module.exports.getById = getById;

// retorna todos los certificados
module.exports.getAll = async function () {
	try {
		let certs = await Cert.getAll();
		if (!certs) return Promise.reject(Messages.CERT.ERR.GET);
		return Promise.resolve(certs);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.GET);
	}
};

module.exports.findBy = async function ({ emmited, revoked }) {
	let certs;
	if (revoked) {
		certs = await Cert.getRevokeds();
	} else {
		certs = await Cert.findByEmission(emmited);
	}
	return toDTO(certs);
};

// crea un certificado a partir del modelo
module.exports.create = async function (data, templateId, split, microCredentials) {
	try {
		const cert = await Cert.generate(data, templateId, split, microCredentials);
		if (!cert) return Promise.reject(Messages.CERT.ERR.CREATE);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.CREATE);
	}
};

// modifica un certificado no emitido
module.exports.edit = async function (id, data, split, microCredentials) {
	try {
		let cert = await getById(id);
		cert = await cert.edit(data, split, microCredentials);
		if (!cert) return Promise.reject(Messages.CERT.ERR.EDIT);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.EDIT);
	}
};

// agrega la informacion de los campos del modelo de certificado al certificaod puntual para ser mostrados
module.exports.addTemplateDataToCert = function (cert, template) {
	const data = {
		cert: cert.data.cert.map(elem => {
			const templateElem = template.data.cert.find(tempElem => tempElem.name === elem.name);
			return {
				name: elem.name,
				type: templateElem.type,
				options: templateElem.options,
				value: elem.value ? elem.value : templateElem.defaultValue ? templateElem.defaultValue : "",
				required: templateElem.required,
				mandatory: templateElem.mandatory
			};
		}),
		participant: cert.data.participant.map(array => {
			return array.map(elem => {
				const templateElem = template.data.participant.find(tempElem => tempElem.name === elem.name);
				return {
					name: elem.name,
					type: templateElem.type,
					options: templateElem.options,
					value: elem.value ? elem.value : templateElem.defaultValue ? templateElem.defaultValue : "",
					required: templateElem.required,
					mandatory: templateElem.mandatory
				};
			});
		}),
		others: cert.data.others.map(elem => {
			const templateElem = template.data.others.find(tempElem => tempElem.name === elem.name);
			return {
				name: elem.name,
				type: templateElem.type,
				options: templateElem.options,
				value: elem.value ? elem.value : templateElem.defaultValue ? templateElem.defaultValue : "",
				required: templateElem.required,
				mandatory: templateElem.mandatory
			};
		})
	};
	return {
		_id: cert._id,
		split: cert.split,
		microCredentials: cert.microCredentials,
		templateId: cert.templateId,
		emmitedOn: cert.emmitedOn,
		data: data
	};
};

// marcar certificado como emitido
module.exports.emmit = async function (cert, creds) {
	try {
		await cert.emmit(creds);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.EMMIT);
	}
};

// marcar certificado como borrado
module.exports.delete = async function (id) {
	try {
		let cert = await getById(id);
		cert = await cert.delete();
		if (!cert) return Promise.reject(Messages.CERT.ERR.DELETE);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.DELETE);
	}
};

// revoca un certificado
module.exports.revoke = async function (id, reason) {
	const cert = await Cert.revokeById(id, reason);
	if (!cert) throw Messages.CERT.ERR.REVOKE;
	return cert;
};
