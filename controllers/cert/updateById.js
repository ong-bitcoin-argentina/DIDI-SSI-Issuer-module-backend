const ResponseHandler = require('../../routes/utils/ResponseHandler');
const CertService = require('../../services/CertService');

const updateById = async (req, res) => {
  const { id } = req.params;
  const { split, microCredentials } = req.body;
  let data;

  try {
    data = JSON.parse(req.body.data);
  } catch (e) {
    return ResponseHandler.sendErr(res, new Error('El parametro data no es un JSON válido'));
  }
  try {
    const cert = await CertService.edit(id, data, split, microCredentials);
    return ResponseHandler.sendRes(res, cert);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateById,
};
