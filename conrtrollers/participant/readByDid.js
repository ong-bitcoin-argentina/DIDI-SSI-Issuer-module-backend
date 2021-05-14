const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const readByDid = async (req, res) => {
  const { did } = req.params;
  try {
    const participant = await ParticipantService.getByDid(did);
    return ResponseHandler.sendRes(res, participant);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readByDid,
};
