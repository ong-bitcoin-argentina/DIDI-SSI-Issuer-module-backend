const ResponseHandler = require('../../routes/utils/ResponseHandler');
const CertService = require('../../services/CertService');

const updateDeleted = async (req, res) => {
  try {
    const result = await CertService.updateAllDeleted();
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  updateDeleted,
};
