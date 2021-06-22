const TemplateService = require('../../services/TemplateService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const removeById = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await TemplateService.delete(id);
    return ResponseHandler.sendRes(res, template);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  removeById,
};
