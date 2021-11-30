const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareRequestService = require('../../services/ShareRequestService');

const readById = async (req, res) => {
  try {
    const { id } = req.params;

    const shareRequest = await ShareRequestService.getById(id);

    return ResponseHandler.sendRes(res, shareRequest);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readById,
};
