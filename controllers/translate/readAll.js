const ResponseHandler = require('../../routes/utils/ResponseHandler');
const TranslateService = require('../../services/TranslateService');

const readAll = async (_req, res) => {
  try {
    const TranslateList = await TranslateService.getAll();

    return ResponseHandler.sendRes(res, TranslateList);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readAll,
};
