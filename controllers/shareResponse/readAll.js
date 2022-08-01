const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareResponseService = require('../../services/ShareResponseService');

const readAll = async (_req, res) => {
  try {
    const ShareResponseList = await ShareResponseService.getAll();

    return ResponseHandler.sendRes(res, ShareResponseList);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readAll,
};
