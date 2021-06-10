/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { ObjectId } = mongoose;
const Constants = require('../constants/Constants');

const populateRegister = {
  path: 'templateId',
  populate: {
    path: 'registerId',
    model: 'Register',
  },
};

// certificado generado a partir de un modelo, para ser completado y emitido

const dataElement = {
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
};

const revokeSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    enum: ['EXPIRATION', 'UNLINKING', 'DATA_MODIFICATION', 'REPLACEMENT', 'OTHER'],
  },
  userId: {
    type: ObjectId,
    ref: 'User',
  },
});

const CertSchema = mongoose.Schema({
  data: {
    cert: [dataElement],
    participant: [[dataElement]],
    others: [dataElement],
  },
  templateId: {
    type: ObjectId,
    required: true,
    ref: 'Template',
  },
  split: {
    type: Boolean,
    default: false,
  },
  microCredentials: [
    {
      title: { type: String },
      names: [{ type: String }],
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  emmitedOn: {
    type: Date,
  },
  revocation: revokeSchema,
  jwts: [
    {
      data: {
        type: String,
      },
      hash: {
        type: String,
      },
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

CertSchema.index({ name: 1 });

// marcar certificado como borrado en bd local
// eslint-disable-next-line func-names
CertSchema.methods.delete = async function () {
  this.deleted = true;
  await this.save();
  return this;
};

// revoca un certificado
CertSchema.methods.revoke = async function revoke(reason, userId) {
  this.deleted = false;
  this.revocation = {
    date: new Date(),
    reason,
    userId,
  };
  await this.save();
  return this;
};

// marcar certificado como emitido en bd local
CertSchema.methods.emmit = async function emmit(creds) {
  const now = new Date();

  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { emmitedOn: now, jwts: creds },
  };

  try {
    await Cert.findOneAndUpdate(updateQuery, updateAction);
    this.emmitedOn = now;
    return Promise.resolve(this);
  } catch (err) {
    return Promise.reject(err);
  }
};

// copiar los campos de 'data' al formato requerido por el certificado
// TODO: Refactorizar
const copyData = function copyData(certData) {
  return {
    cert: certData.cert
      .map((data) => {
        // eslint-disable-next-line no-param-reassign
        if (data.name === Constants.CERT_FIELD_MANDATORY.DID) data.name = data.name.trim();
        return {
          name: data.name,
          value: data.value ? data.value : '',
        };
      })
      .filter((data) => data.value !== ''),
    participant: certData.participant
      .map((array) => array.map((data) => ({ name: data.name, value: data.value ? data.value : '' })))
      .filter((data) => data.value !== ''),
    others: certData.others
      .map((data) => ({ name: data.name, value: data.value ? data.value : '' }))
      .filter((data) => data.value !== ''),
  };
};

// modificar certificado
CertSchema.methods.edit = async function edit(data, split, microCredentials) {
  this.data = copyData(data);
  this.split = split;
  this.microCredentials = microCredentials;

  try {
    await this.save();
    return Promise.resolve(this);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const Cert = mongoose.model('Cert', CertSchema);
module.exports = Cert;

// crear certificado a partir de la data y el modelo de certificado
Cert.generate = async function generate(data, templateId, split, microCredentials) {
  try {
    let cert = new Cert();
    cert.split = split;
    cert.microCredentials = microCredentials;
    cert.data = copyData(data);
    cert.templateId = templateId;
    cert.jwts = [];
    cert.createdOn = new Date();
    cert.deleted = false;

    cert = await cert.save();
    return Promise.resolve(cert);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// obtener todos los certificados
Cert.getAll = async function getAll() {
  try {
    const query = { deleted: false };
    const certs = await Cert.find(query).populate(populateRegister).sort({ createdOn: -1 });
    return Promise.resolve(certs);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// obtener certificados revocados
Cert.getRevokeds = async function getRevokeds() {
  const query = { revocation: { $exists: true } };
  return await Cert.find(query).populate(populateRegister).sort({ 'revocation.date': -1 });
};

// obtener certificados segun su emision
Cert.findByEmission = async function findByEmission(emmited) {
  const query = { deleted: false, emmitedOn: { $exists: emmited }, revocation: { $exists: false } };
  return await Cert.find(query).populate(populateRegister).sort({ createdOn: -1 });
};

// obtener certificado por id
Cert.getById = async function getById(id) {
  try {
    const query = { _id: id, deleted: false };
    const cert = await Cert.findOne(query);
    return Promise.resolve(cert);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

Cert.updateAllDeleted = async function updateAllDeleted() {
  const query = { deleted: true, emmitedOn: { $exists: true } };
  const promises = [];
  await Cert.find(query, (err, certs) => {
    for (const cert of certs) {
      cert.deleted = false;
      cert.revocation = { date: cert.emmitedOn };
      promises.push(cert.save());
    }
  });
  return await Promise.all(promises);
};
