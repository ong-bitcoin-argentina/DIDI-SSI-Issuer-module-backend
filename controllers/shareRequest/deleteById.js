const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareRequestService = require('../../services/ShareRequestService');

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShareReq = ShareRequestService.remove(id);

    return ResponseHandler.sendRes(res, deletedShareReq);
  } catch (err) {
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  deleteById,
};
