const ResponseHandler = require('../../routes/utils/ResponseHandler');
const TemplateService = require('../../services/TemplateService');
const CertService = require('../../services/CertService');

const readById = async (req, res) => {
  const { id } = req.params;
  let cert;
  try {
    cert = await CertService.getById(id);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }

  let template;
  try {
    template = await TemplateService.getById(cert.templateId);
    // agregar data del template al certificado (tipos, valores por defecto, etc)
    const result = CertService.addTemplateDataToCert(cert, template);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readById,
};
