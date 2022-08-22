const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareResponseService = require('../../services/ShareResponseService');

const searchCredentials = async (req, res) => {
  try {
    const { term } = req.params;
    const dids = await ShareResponseService.searchCredentials(term);
    return ResponseHandler.sendRes(res, dids);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  searchCredentials,
};
