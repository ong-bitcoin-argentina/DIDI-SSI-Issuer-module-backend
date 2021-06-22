const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const updateById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const data = JSON.parse(req.body.data);

  try {
    const participant = await ParticipantService.edit(id, name, data);
    return ResponseHandler.sendRes(res, participant);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateById,
};
