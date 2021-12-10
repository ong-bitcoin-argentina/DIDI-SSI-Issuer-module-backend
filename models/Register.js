/* eslint-disable camelcase */
/* eslint-disable no-return-await */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Encryption = require('./utils/Encryption');
const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');

const RegisterSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  did: {
    type: String,
    required: true,
    unique: true,
  },
  private_key: {
    type: String,
    required: true,
  },
  imageId: {
    type: String,
  },
  messageError: {
    type: String,
  },
  blockHash: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: Constants.STATUS.CREATING,
  },
  expireOn: {
    type: Date,
  },
});

RegisterSchema.index({ name: 1 });

RegisterSchema.methods.edit = async function edit(data) {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: data,
  };
  try {
    return await Register.findOneAndUpdate(
      updateQuery, updateAction, { new: true, omitUndefined: true },
    );
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const Register = mongoose.model('Register', RegisterSchema);
module.exports = Register;

// crea un nuevo registro
Register.generate = async function generate(did, key, name, description, imageId) {
  let register;
  try {
    register = new Register();

    register.name = name;
    register.description = description;
    const keyEncripted = await Encryption.encrypt(key);
    register.private_key = keyEncripted;
    register.did = did;
    register.deleted = false;
    register.createdOn = new Date();
    register.imageId = imageId;

    register = await register.save();
    return Promise.resolve(register);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// obtener todos los registros
Register.getAll = async function getAll(filter) {
  try {
    const query = { deleted: false, ...filter };
    const registers = await Register.find(query).sort({ createdOn: -1 });
    return Promise.resolve(registers);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// obtener un registro por el did
Register.getByDID = async function getByDID(did) {
  const register = await Register.findOne({ did });

  if (!register) throw Messages.REGISTER.ERR.NOT_EXIST;

  const privateKey = await Encryption.decript(register.private_key);
  register.private_key = privateKey;

  return register;
};

// obtener un registro por el id
Register.getById = async function getById(_id) {
  const register = await Register.findOne({ _id });

  if (!register) throw Messages.REGISTER.ERR.NOT_EXIST;

  const privateKey = await Encryption.decript(register.private_key);
  register.private_key = privateKey;

  return register;
};

Register.getCredentials = async function getCredentials(_id) {
  const register = await Register.findOne({ _id });
  if (!register) throw Messages.REGISTER.ERR.NOT_EXIST;
  const { did, private_key } = register;

  const key = await Encryption.decript(private_key);
  return { did, key };
};

Register.existsIssuer = async function existsIssuer(did) {
  const register = await Register.findOne({ did });

  if (!register) return false;

  return true;
};
