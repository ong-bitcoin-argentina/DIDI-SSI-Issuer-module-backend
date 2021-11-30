const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareRequestService = require('../../services/ShareRequestService');

const create = async (req, res) => {
  try {
    const { claims, name } = req.body;

    const claimsMap = new Map(claims);

    const shareRequest = await ShareRequestService.create(name, claimsMap);

    return ResponseHandler.sendRes(res, shareRequest);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
