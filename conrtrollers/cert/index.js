const { readAll } = require('./readAll');
const { readByQuery } = require('./readByQuery');
const { readById } = require('./readById');
const { create } = require('./create');
const { updateById } = require('./updateById');
const { removeById } = require('./removeById');
const { emmitById } = require('./emmitById');
const { updateDeleted } = require('./updateDeleted');

module.exports = {
  readAll,
  readByQuery,
  readById,
  create,
  updateById,
  removeById,
  emmitById,
  updateDeleted,
};
