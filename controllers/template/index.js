const { readAll } = require('./readAll');
const { readById } = require('./readById');
const { create } = require('./create');
const { updateById } = require('./updateById');
const { removeById } = require('./removeById');
const { createRequestByCode } = require('./createRequestByCode');
const { createRequestByTemplateId } = require('./createRequestByTemplateId');

module.exports = {
  readAll,
  readById,
  create,
  updateById,
  removeById,
  createRequestByCode,
  createRequestByTemplateId,
};
