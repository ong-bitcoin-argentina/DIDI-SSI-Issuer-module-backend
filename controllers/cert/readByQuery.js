const ResponseHandler = require('../../routes/utils/ResponseHandler');
const CertService = require('../../services/CertService');

const readByQuery = async (req, res) => {
  try {
    const result = await CertService.findBy(req.query);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readByQuery,
};
