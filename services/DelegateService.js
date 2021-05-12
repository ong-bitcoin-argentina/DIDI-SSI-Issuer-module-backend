/* eslint-disable no-console */
const Delegate = require('../models/Delegate');
const Messages = require('../constants/Messages');
const { missingDid, missingName, missingRegisterId } = require('../constants/serviceErrors');

// obtiene todas las delegaciones
module.exports.getAll = async function getAll() {
  try {
    const delegates = await Delegate.getAll();
    return Promise.resolve(delegates);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.DELEGATE.ERR.GET);
  }
};

// registra una nueva delegacion en la base de datos local
module.exports.create = async function create(did, name, registerId) {
  if (!did) throw missingDid;
  if (!name) throw missingName;
  if (!registerId) throw missingRegisterId;
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
module.exports.delete = async function remove(did) {
  if (!did) throw missingDid;
  try {
    const delegate = await Delegate.delete(did);
    if (!delegate) return Promise.reject(Messages.DELEGATE.ERR.GET);
    return Promise.resolve(delegate);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.DELEGATE.ERR.DELETE);
  }
};
