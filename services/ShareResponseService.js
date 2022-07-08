/* eslint-disable no-console */
const { validateMessageRes } = require('@proyecto-didi/vc-validator/');
const ShareResponse = require('../models/ShareResponse');
const Register = require('../models/Register');

const { missingShareResp, missingId } = require('../constants/serviceErrors');

module.exports = require('./utils/shareResponseValidate');

module.exports.create = async (jwt, shareRequestId) => {
  if (!jwt) throw missingShareResp;
  try {
    const validJwt = validateMessageRes(jwt);
    if (!validJwt.status) throw validJwt;
    const register = await Register.getById(shareRequestId);
    return ShareResponse.generate(jwt, shareRequestId, register.did);
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
