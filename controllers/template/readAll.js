const TemplateService = require('../../services/TemplateService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const { toDTO } = require('../../routes/utils/TemplateDTO');

const readAll = async (_, res) => {
  try {
    const templates = await TemplateService.getAll();
    const result = toDTO(templates);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAll,
};
