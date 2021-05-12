const { create } = require('./create');
const { createAdmin } = require('./createAdmin');
const { validatePassword } = require('./validatePassword');
const { remove } = require('./remove');
const { readAll } = require('./readAll');
const { update } = require('./update');

module.exports = {
  create,
  createAdmin,
  validatePassword,
  remove,
  readAll,
  update,
};
