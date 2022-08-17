const { create } = require('./create');
const { readById } = require('./readById');
const { readAllByDid } = require('./readByDID');
const { readAll } = require('./readAll');
const { searchCredentials } = require('./searchCredentials');

module.exports = {
  create,
  readById,
  readAll,
  readAllByDid,
  searchCredentials,
};
