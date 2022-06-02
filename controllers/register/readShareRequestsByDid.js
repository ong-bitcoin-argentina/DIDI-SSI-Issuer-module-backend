const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterService = require('../../services/RegisterService');
const BlockchainService = require('../../services/BlockchainService');

const readShareRequestsByDid = async (req, res) => {
  try {
    const { did } = req.params;

    const { list, totalPages } = await RegisterService.getShareRequestsByDid(did, {
      iss: did,
    });
    const decodedShareRequestList = await Promise.all(
      list.map(async (shareReq) => {
        const { payload } = await BlockchainService.decodeJWT(shareReq.jwt);
        return { ...shareReq, payload };
      }),
    );
    return ResponseHandler.sendRes(res, { list: decodedShareRequestList, totalPages });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  readShareRequestsByDid,
};
