const Participant = require("../models/Participant");
const Messages = require("../constants/Messages");

// retorna la info de participante asociada a un usuario en particular
var getByDid = async function(did) {
	try {
		let participant = await Participant.getByDid(did);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};
module.exports.getByDid = getByDid;

// retorna la info de participante a partir de su id
var getById = async function(id) {
	try {
		let participant = await Participant.getById(id);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};
module.exports.getById = getById;

// retorna la info de participante no asociada a un modelo en particular (tel, mail, y certs de renaper)
module.exports.getGlobalParticipants = async function() {
	try {
		let participants = await Participant.getGlobalParticipants();
		return Promise.resolve(participants);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};

// retorna la info de participante para un modelo de certificado en particular
module.exports.getAllByTemplateId = async function(templateId) {
	try {
		let participants = await Participant.getAllByTemplateId(templateId);
		return Promise.resolve(participants);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};

// retorna un objeto con todos los dids sobre los que se tiene info y los nombres de los usuarios asociados a los mismos
module.exports.getAllDids = async function() {
	try {
		let participants = await Participant.getAllDids();
		return Promise.resolve(participants);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};

// obtiene la info de participante por numero de pedido
// (para hacer pulling en qr)
module.exports.getByRequestCode = async function(requestCode) {
	try {
		let participant = await Participant.getByRequestCode(requestCode);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.GET);
	}
};

// genera la info de participante
module.exports.create = async function(name, did, data, templateId, code) {
	try {
		const participant = await Participant.generate(name, did, data, templateId, code);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.CREATE);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.CREATE);
	}
};

// modifica la info de participante
module.exports.edit = async function(id, name, data) {
	try {
		let participant = await getById(id);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
		participant = await participant.edit(name, data);
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.EDIT);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.EDIT);
	}
};

// marca la info de participante como borrada
module.exports.delete = async function(id) {
	try {
		let participant = await getById(id);
		participant = await participant.delete();
		if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.DELETE);
		return Promise.resolve(participant);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.PARTICIPANT.ERR.DELETE);
	}
};
