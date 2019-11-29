const Cert = require("../models/Cert");
const Messages = require("../constants/Messages");

var getById = async function(id) {
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

module.exports.getAll = async function() {
	try {
		let certs = await Cert.getAll();
		if (!certs) return Promise.reject(Messages.CERT.ERR.GET);
		return Promise.resolve(certs);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.GET);
	}
};

module.exports.create = async function(data, templateId) {
	try {
		const cert = await Cert.generate(data, templateId);
		if (!cert) return Promise.reject(Messages.CERT.ERR.CREATE);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.CREATE);
	}
};

module.exports.edit = async function(id, data) {
	try {
		let cert = await getById(id);
		cert = await cert.edit(data);
		if (!cert) return Promise.reject(Messages.CERT.ERR.CREATE);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.CREATE);
	}
};

module.exports.addTemplateDataToCert = function(cert, template) {
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
		templateId: cert.templateId,
		emmitedOn: cert.emmitedOn,
		data: data
	};
};

module.exports.emmit = async function(cert, credentials) {
	try {
		await cert.emmit(credentials);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.CREATE);
	}
};

module.exports.delete = async function(id) {
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
