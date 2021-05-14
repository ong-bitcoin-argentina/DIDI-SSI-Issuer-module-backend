/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const create = async (req, res) => {
  const { data } = req.body;
  // const dids = data.map(dataElem => dataElem.did);
  try {
    const result = [];
    for (const dataElem of data) {
      const participant = await ParticipantService.create(dataElem.name, dataElem.did, [], undefined, '');
      if (participant.did && participant.name) result.push({ did: participant.did, name: participant.name });
    }
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
