const Delegate = require("../models/Delegate");
const Messages = require("../constants/Messages");

// obtiene todas las delegaciones
module.exports.getAll = async function () {
	try {
		const delegates = await Delegate.getAll();
		return Promise.resolve(delegates);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.GET);
	}
};

// registra una nueva delegacion en la base de datos local
module.exports.create = async function (did, name, registerId) {
	try {
		const delegate = await Delegate.generate(did, name, registerId);
		if (!delegate) return Promise.reject(Messages.DELEGATE.ERR.CREATE);
		return Promise.resolve(delegate);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.CREATE);
	}
};

// marca la delegacion como borrada en la base de datos local
module.exports.delete = async function (did) {
	try {
		const delegate = await Delegate.delete(did);
		if (!delegate) return Promise.reject(Messages.DELEGATE.ERR.GET);
		return Promise.resolve(delegate);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.DELEGATE.ERR.DELETE);
	}
};
