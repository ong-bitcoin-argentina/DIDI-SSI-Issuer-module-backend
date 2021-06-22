const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const removeById = async (req, res) => {
  const { id } = req.params;

  try {
    const participant = await ParticipantService.delete(id);
    return ResponseHandler.sendRes(res, participant);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  removeById,
};
