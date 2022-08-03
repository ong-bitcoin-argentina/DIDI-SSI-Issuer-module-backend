const { create } = require('./create');
const { readById } = require('./readById');
const { readByIdDecoded } = require('./readByIdDecoded');
const { readAllByDid } = require('./readByDID');
const { readAll } = require('./readAll');

module.exports = {
  create,
  readById,
  readAll,
  readAllByDid,
  readByIdDecoded,
};
