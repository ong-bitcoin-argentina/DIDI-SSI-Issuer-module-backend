const { create } = require('./create');
const { readAll } = require('./readAll');
const { readById } = require('./readById');
const { deleteById } = require('./deleteById');

module.exports = {
  create,
  readAll,
  readById,
  deleteById,
};
