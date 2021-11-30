/* eslint-disable no-console */
const ShareRequest = require('../models/ShareRequest');

const { missingId, missingName, missingClaims } = require('../constants/serviceErrors');

module.exports.create = async (name, claims) => {
  if (!name) throw missingName;
  if (!claims) throw missingClaims;
  try {
    return ShareRequest.generate(name, claims);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.getAll = async () => {
  try {
    return ShareRequest.getAll();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.getById = async (id) => {
  if (!id) throw missingId;
  try {
    return ShareRequest.getById(id);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.delete = async (id) => {
  if (!id) throw missingId;
  try {
    return ShareRequest.remove(id);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
