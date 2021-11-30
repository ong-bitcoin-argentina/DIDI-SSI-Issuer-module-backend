const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareRequestService = require('../../services/ShareRequestService');

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShareReq = ShareRequestService.delete(id);

    return ResponseHandler.sendRes(res, deletedShareReq);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  deleteById,
};
