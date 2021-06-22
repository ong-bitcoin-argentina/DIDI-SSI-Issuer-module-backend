const { readDids } = require('./readDids');
const { readAll } = require('./readAll');
const { readAllByTemplateId } = require('./readAllByTemplateId');
const { readByRequestCode } = require('./readByRequestCode');
const { readByDid } = require('./readByDid');
const { create } = require('./create');
const { updateById } = require('./updateById');
const { removeById } = require('./removeById');
const { createByRequestCode } = require('./createByRequestCode');
const { createByTemplateId } = require('./createByTemplateId');

module.exports = {
  readDids,
  readAll,
  readAllByTemplateId,
  readByRequestCode,
  readByDid,
  create,
  updateById,
  removeById,
  createByRequestCode,
  createByTemplateId,
};
