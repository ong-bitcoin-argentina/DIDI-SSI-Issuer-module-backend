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

module.exports.create = async function(template, partData, data) {
	try {
		const cert = await Cert.generate(template, partData, data);
		if (!cert) return Promise.reject(Messages.CERT.ERR.CREATE);
		return Promise.resolve(cert);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.CERT.ERR.CREATE);
	}
};

module.exports.emmit = async function(id) {
	try {
		let cert = await getById(id);
		await cert.emmit();
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
