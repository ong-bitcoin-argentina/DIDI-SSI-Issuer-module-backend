const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterService = require('../../services/RegisterService');

const readShareRequestById = async (req, res) => {
  try {
    const { id, did } = req.params;

    const ShareRequest = await RegisterService.getShareRequestById(id, did);

    return ResponseHandler.sendRes(res, ShareRequest);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readShareRequestById,
};
