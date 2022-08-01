const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareResponseService = require('../../services/ShareResponseService');

const readAllByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const shareResponse = await ShareResponseService.getByDID(did);
    return ResponseHandler.sendRes(res, shareResponse);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readAllByDid,
};
