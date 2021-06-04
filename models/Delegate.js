/* eslint-disable no-console */
const mongoose = require('mongoose');
const Messages = require('../constants/Messages');
const Encryption = require('./utils/Encryption');

const { ObjectId } = mongoose;

// Registro local de las delegaciones del issuer para emitir certificados
const DelegateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  did: {
    type: String,
    required: true,
  },
  register: {
    type: ObjectId,
    required: true,
    ref: 'Register',
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

DelegateSchema.index({ did: 1 });

const Delegate = mongoose.model('Delegate', DelegateSchema);
module.exports = Delegate;

// obtiene todas las delegaciones
Delegate.getAll = async function getAll() {
  const query = { deleted: false };
  const delegates = await Delegate.find(query);
  return Promise.resolve(delegates);
};

// registra una nueva delegacion en la base de datos local
Delegate.generate = async function generate(did, name, register) {
  let delegate;
  try {
    const query = { did: name };
    delegate = await Delegate.findOne(query);

    if (!delegate) delegate = new Delegate();

    delegate.did = did;
    delegate.name = name;
    delegate.register = register;
    delegate.deleted = false;
    delegate.createdOn = new Date();

    delegate = await delegate.save();
    return Promise.resolve(delegate);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// marca la delegacion como borrada en la base de datos local
// eslint-disable-next-line func-names
Delegate.delete = async function (did) {
  try {
    const query = { did };
    const action = { $set: { deleted: true } };
    const delegate = await Delegate.findOneAndUpdate(query, action);
    if (delegate) delegate.deleted = true;
    return Promise.resolve(delegate);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

Delegate.getByDid = async function getByDid(did) {
  const delegate = await Delegate.findOne({ did }).populate('register');
  if (!delegate) throw Messages.DELEGATE.ERR.NOT_EXIST;

  const privateKey = await Encryption.decript(delegate.register.private_key);
  delegate.register.private_key = privateKey;

  return delegate;
};
