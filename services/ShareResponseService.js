/* eslint-disable no-console */
const { validateMessageRes } = require('@proyecto-didi/vc-validator/');
const ShareResponse = require('../models/ShareResponse');

const { missingShareResp, missingId } = require('../constants/serviceErrors');

module.exports.create = async (jwt) => {
  if (!jwt) throw missingShareResp;
  try {
    const validJwt = validateMessageRes(jwt);
    if (!validJwt.status) throw validJwt;
    return ShareResponse.generate(jwt);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.getById = async (id) => {
  if (!id) throw missingId;
  try {
    return ShareResponse.getById(id);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
