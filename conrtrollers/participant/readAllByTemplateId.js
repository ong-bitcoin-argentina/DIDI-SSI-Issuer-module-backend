const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const readAllByTemplateId = async (req, res) => {
  const { templateId } = req.params;
  try {
    const participants = await ParticipantService.getAllByTemplateId(templateId);
    const result = participants.map((partData) => ({ did: partData.did, name: partData.name }));
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAllByTemplateId,
};
