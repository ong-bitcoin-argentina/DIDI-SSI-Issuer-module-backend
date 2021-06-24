/* eslint-disable no-console */
/* eslint-disable max-len */
const Cert = require('../models/Cert');
const Messages = require('../constants/Messages');
const {
  toDTO,
} = require('../routes/utils/CertDTO');
const {
  missingId,
  missingData,
  missingTemplateId,
  missingSplit,
  missingCert,
  missingCreds,
  missingReason,
  missingUserId,
  missingTemplate,
} = require('../constants/serviceErrors');

const getById = async function getById(id) {
  if (!id) throw missingId;
  try {
    const cert = await Cert.getById(id);
    if (!cert) return Promise.reject(Messages.CERT.ERR.GET);
    return Promise.resolve(cert);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.CERT.ERR.GET);
  }
};

module.exports.getById = getById;

// retorna todos los certificados
module.exports.getAll = async function getAll() {
  try {
    const certs = await Cert.getAll();
    if (!certs) return Promise.reject(Messages.CERT.ERR.GET);
    return Promise.resolve(certs);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.CERT.ERR.GET);
  }
};

module.exports.findBy = async function findBy({
  emmited,
  revoked,
}) {
  let certs;
  if (revoked) {
    certs = await Cert.getRevokeds();
  } else {
    certs = await Cert.findByEmission(emmited);
  }
  return toDTO(certs);
};

// crea un certificado a partir del modelo
module.exports.create = async function create(data, templateId, split, microCredentials) {
  if (!data) throw missingData;
  if (!templateId) throw missingTemplateId;
  if (split === undefined || split === null) throw missingSplit;
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
module.exports.edit = async function edit(id, data, split, microCredentials) {
  if (!id) throw missingId;
  if (!data) throw missingData;
  if (split === undefined || split === null) throw missingSplit;
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
module.exports.addTemplateDataToCert = function addTemplateDataToCert(cert, template) {
  if (!cert) throw missingCert;
  if (!template) throw missingTemplate;
  const data = {
    cert: cert.data.cert.map((elem) => {
      const templateElem = template.data.cert.find((tempElem) => tempElem.name === elem.name);
      return {
        name: elem.name,
        type: templateElem.type,
        options: templateElem.options,
        // eslint-disable-next-line no-nested-ternary
        value: elem.value ? elem.value : templateElem.defaultValue ? templateElem.defaultValue : '',
        required: templateElem.required,
        mandatory: templateElem.mandatory,
      };
    }),
    participant: cert.data.participant.map((array) => array.map((elem) => {
      const templateElem = template.data.participant.find((tempElem) => tempElem.name === elem.name);
      return {
        name: elem.name,
        type: templateElem.type,
        options: templateElem.options,
        // eslint-disable-next-line no-nested-ternary
        value: elem.value ? elem.value : templateElem.defaultValue ? templateElem.defaultValue : '',
        required: templateElem.required,
        mandatory: templateElem.mandatory,
      };
    })),
    others: cert.data.others.map((elem) => {
      const templateElem = template.data.others.find((tempElem) => tempElem.name === elem.name);
      return {
        name: elem.name,
        type: templateElem.type,
        options: templateElem.options,
        // eslint-disable-next-line no-nested-ternary
        value: elem.value ? elem.value : templateElem.defaultValue ? templateElem.defaultValue : '',
        required: templateElem.required,
        mandatory: templateElem.mandatory,
      };
    }),
  };
  return {
    // eslint-disable-next-line no-underscore-dangle
    _id: cert._id,
    split: cert.split,
    microCredentials: cert.microCredentials,
    templateId: cert.templateId,
    emmitedOn: cert.emmitedOn,
    revocation: cert.revocation,
    data,
  };
};

// marcar certificado como emitido
module.exports.emmit = async function emmit(cert, creds) {
  if (!cert) throw missingCert;
  if (!creds) throw missingCreds;
  try {
    await cert.emmit(creds);
    return Promise.resolve(cert);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.CERT.ERR.EMMIT);
  }
};

// marcar certificado como borrado o lo revoca dependiendo su emisión
module.exports.deleteOrRevoke = async function deleteOrRevoke(id, reason, userId) {
  if (!id) throw missingId;
  if (!reason) throw missingReason;
  if (!userId) throw missingUserId;
  try {
    let cert = await getById(id);
    if (cert.emmitedOn) {
      cert = await cert.revoke(reason, userId);
    } else {
      cert = await cert.delete();
    }
    if (!cert) throw Messages.CERT.ERR.DELETE;
    return cert;
  } catch (err) {
    console.log(err);
    throw Messages.CERT.ERR.DELETE;
  }
};

// revoca un certificado
module.exports.updateAllDeleted = async function updateAllDeleted() {
  const result = await Cert.updateAllDeleted();
  // eslint-disable-next-line no-throw-literal
  if (!result) throw 'Error al actualizar todos';
  return result;
};
