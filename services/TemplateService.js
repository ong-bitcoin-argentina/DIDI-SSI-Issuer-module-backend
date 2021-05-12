/* eslint-disable max-len */
/* eslint-disable no-console */
const Template = require('../models/Template');
const Messages = require('../constants/Messages');
const Register = require('../models/Register');
const {
  missingId,
  missingName,
  missingRegisterId,
  missingData,
  missingPreviewData,
  missingPreviewType,
  missingCategory,
} = require('../constants/serviceErrors');

// obtener el modelo de certificado a correspondiente a ese id
const getById = async function getById(id) {
  if (!id) throw missingId;
  try {
    const template = await Template.getById(id);
    if (!template) return Promise.reject(Messages.TEMPLATE.ERR.GET);
    return Promise.resolve(template);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.TEMPLATE.ERR.GET);
  }
};
module.exports.getById = getById;

// retorna todos los modelos de certificados
module.exports.getAll = async function getAll() {
  try {
    const templates = await Template.getAll();
    if (!templates) return Promise.reject(Messages.TEMPLATE.ERR.GET);
    return Promise.resolve(templates);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.TEMPLATE.ERR.GET);
  }
};

// genera un nuevo modelo de certificado
module.exports.create = async function create(name, registerId) {
  if (!name) throw missingName;
  if (!registerId) throw missingRegisterId;
  try {
    // Verifico que el registro exista
    await Register.getById(registerId);

    const template = await Template.findOne({ name: { $eq: name } });
    if (template) return Promise.reject(Messages.TEMPLATE.ERR.UNIQUE_NAME);

    return await Template.generate(name, registerId);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// modifica el modelo de certificado
module.exports.edit = async function edit(id, data, previewData, previewType, category, registerId) {
  if (!id) throw missingId;
  if (!data) throw missingData;
  if (!previewData) throw missingPreviewData;
  if (!previewType) throw missingPreviewType;
  if (!category) throw missingCategory;
  if (!registerId) throw missingRegisterId;
  try {
    let template = await getById(id);
    if (!template) return Promise.reject(Messages.TEMPLATE.ERR.GET);

    // Verifico que el registro exista
    await Register.getById(registerId);

    template = await template.edit(data, previewData, previewType, category, registerId);
    if (!template) return Promise.reject(Messages.TEMPLATE.ERR.EDIT);
    return Promise.resolve(template);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// marca el modelo de certificado como borrado
module.exports.delete = async function remove(id) {
  if (!id) throw missingId;
  try {
    let template = await getById(id);
    template = await template.delete();
    if (!template) return Promise.reject(Messages.TEMPLATE.ERR.DELETE);
    return Promise.resolve(template);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.TEMPLATE.ERR.DELETE);
  }
};
