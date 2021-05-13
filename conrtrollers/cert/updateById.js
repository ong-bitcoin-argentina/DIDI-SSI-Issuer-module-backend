const ResponseHandler = require('../../routes/utils/ResponseHandler');
const CertService = require('../../services/CertService');

const updateById = async (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(req.body.data);
  const { split } = req.body;
  const { microCredentials } = req.body;

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
