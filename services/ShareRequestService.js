/* eslint-disable no-console */
const ShareRequest = require('../models/ShareRequest');

const {
  missingId, missingName, missingClaims, missingRegisterId,
} = require('../constants/serviceErrors');

module.exports.create = async (name, claims, registerId) => {
  if (!name) throw missingName;
  if (!claims) throw missingClaims;
  if (!registerId) throw missingRegisterId;
  try {
    return ShareRequest.generate(name, claims, registerId);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.setRefId = async (id, serverRegisterId) => {
  if (!id) throw missingId;
  if (!serverRegisterId) throw missingRegisterId;
  try {
    return ShareRequest.findOneAndUpdate({
      _id: id,
    }, {
      referenceServerRequestId: serverRegisterId,
    });
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
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.remove = async (id) => {
  if (!id) throw missingId;
  try {
    return ShareRequest.remove(id);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
