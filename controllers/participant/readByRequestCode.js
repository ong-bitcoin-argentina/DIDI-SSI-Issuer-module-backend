const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const readByRequestCode = async (req, res) => {
  const { requestCode } = req.params;
  try {
    const participant = await ParticipantService.getByRequestCode(requestCode);
    return ResponseHandler.sendRes(res, participant);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readByRequestCode,
};
