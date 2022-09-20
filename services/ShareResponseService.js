/* eslint-disable no-console */
const { validateMessageRes } = require('@proyecto-didi/vc-validator/');
const ShareResponse = require('../models/ShareResponse');
const ShareRequest = require('../models/ShareRequest');
const { missingShareResp, missingId, missingDid } = require('../constants/serviceErrors');

module.exports = require('./utils/shareResponseValidate');

module.exports.create = async (jwt, shareRequestId) => {
  if (!jwt) throw missingShareResp;
  try {
    const validJwt = validateMessageRes(jwt);
    if (!validJwt.status) throw validJwt;
    const shareRequest = await ShareRequest.getByServerId(shareRequestId);
    return ShareResponse.generate(jwt, shareRequest.id, shareRequest.did);
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

module.exports.getByIdDecoded = async (id) => {
  try {
    const shareResp = await module.exports.getById(id);
    const decoded = await module.exports.decodeShareResponse(shareResp);
    const shareRespJSON = shareResp.toJSON();
    shareRespJSON.decoded = decoded;
    return Promise.resolve(shareRespJSON);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.getByDID = async (did) => {
  if (!did) throw missingDid;
  try {
    return ShareResponse.getByDID(did);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.getAll = async () => {
  try {
    return ShareResponse.getAll();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
