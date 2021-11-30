const ResponseHandler = require('../../routes/utils/ResponseHandler');
const shareRequestService = require('../../services/ShareRequestService');

const readAll = async (req, res) => {
  try {
    const ShareRequestsList = await shareRequestService.getAll();

    return ResponseHandler.sendRes(res, ShareRequestsList);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAll,
};
