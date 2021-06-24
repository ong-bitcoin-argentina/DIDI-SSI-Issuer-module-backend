/* eslint-disable max-len */
/* eslint-disable no-console */
const Participant = require('../models/Participant');
const Messages = require('../constants/Messages');
const {
  missingDid,
  missingId,
  missingTemplateId,
  missingRequestCode,
  missingName,
  missingData,
} = require('../constants/serviceErrors');

// retorna la info de participante asociada a un usuario en particular
const getByDid = async function getByDid(did) {
  if (!did) throw missingDid;
  try {
    const participant = await Participant.getByDid(did);
    if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
    return Promise.resolve(participant);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.PARTICIPANT.ERR.GET);
  }
};

module.exports.getByDid = getByDid;

// retorna la info de participante a partir de su id
const getById = async function getById(id) {
  if (!id) throw missingId;
  try {
    const participant = await Participant.getById(id);
    if (!participant) return Promise.reject(Messages.PARTICIPANT.ERR.GET);
    return Promise.resolve(participant);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.PARTICIPANT.ERR.GET);
  }
};
module.exports.getById = getById;

// retorna la info de participante no asociada a un modelo en particular (tel, mail, y certs de renaper)
module.exports.getGlobalParticipants = async function getGlobalParticipants() {
  try {
    const participants = await Participant.getGlobalParticipants();
    return Promise.resolve(participants);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.PARTICIPANT.ERR.GET);
  }
};

// retorna la info de participante para un modelo de certificado en particular
module.exports.getAllByTemplateId = async function getAllByTemplateId(templateId) {
  if (!templateId) throw missingTemplateId;
  try {
    const participants = await Participant.getAllByTemplateId(templateId);
    return Promise.resolve(participants);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.PARTICIPANT.ERR.GET);
  }
};

// retorna un objeto con todos los dids sobre los que se tiene info y los nombres de los usuarios asociados a los mismos
module.exports.getAllDids = async function getAllDids() {
  try {
    const participants = await Participant.getAllDids();
    return Promise.resolve(participants);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.PARTICIPANT.ERR.GET);
  }
};

// obtiene la info de participante por numero de pedido
// (para hacer pulling en qr)
module.exports.getByRequestCode = async function getByRequestCode(requestCode) {
  if (!requestCode) throw missingRequestCode;
  try {
    const participant = await Participant.getByRequestCode(requestCode);
    return Promise.resolve(participant);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.PARTICIPANT.ERR.GET);
  }
};

// genera la info de participante
module.exports.create = async function create(name, did, data, templateId, code) {
  if (!name) throw missingName;
  if (!did) throw missingDid;
  if (!data) throw missingData;
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
module.exports.edit = async function edit(id, name, data) {
  if (!id) throw missingId;
  if (!name) throw missingName;
  if (!data) throw missingData;
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
module.exports.delete = async function remove(id) {
  if (!id) throw missingId;
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
