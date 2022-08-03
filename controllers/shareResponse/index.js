const { create } = require('./create');
const { readById } = require('./readById');
const { readAllByDid } = require('./readByDID');
const { readAll } = require('./readAll');
const { readByIdDecoded } = require('./readByIdDecoded');

module.exports = {
  create,
  readById,
  readAll,
  readAllByDid,
  readByIdDecoded,
};
