const TemplateService = require('../../services/TemplateService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const readById = async (req, res) => {
  const { id } = req.params;
  try {
    const template = await TemplateService.getById(id);
    delete template.deleted;
    delete template.createdOn;
    return ResponseHandler.sendRes(res, template);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readById,
};
