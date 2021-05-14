/* eslint-disable no-restricted-syntax */
const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const readDids = async (_, res) => {
  try {
    const partDids = await ParticipantService.getAllDids();
    const result = [];
    for (const key of Object.keys(partDids)) result.push({ did: key, name: partDids[key] });
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readDids,
};
