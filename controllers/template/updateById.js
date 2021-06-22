const TemplateService = require('../../services/TemplateService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const updateById = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const { preview, type, registerId } = req.body;

  const category = req.body.category || '';
  const { id } = req.params;

  try {
    const template = await TemplateService.edit(id, data, preview, type, category, registerId);
    return ResponseHandler.sendRes(res, template);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateById,
};
