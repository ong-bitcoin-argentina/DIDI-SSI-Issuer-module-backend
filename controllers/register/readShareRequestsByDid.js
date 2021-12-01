const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterService = require('../../services/RegisterService');

const readShareRequestsByDid = async (req, res) => {
  try {
    const { did } = req.params;

    const shareRequestList = await RegisterService.getShareRequestsByDid(did);

    return ResponseHandler.sendRes(res, shareRequestList);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readShareRequestsByDid,
};
