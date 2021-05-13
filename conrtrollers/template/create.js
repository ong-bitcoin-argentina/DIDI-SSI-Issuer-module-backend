const TemplateService = require('../../services/TemplateService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const create = async (req, res) => {
  const { name, registerId } = req.body;

  try {
    const template = await TemplateService.create(name, registerId);
    return ResponseHandler.sendRes(res, template);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
