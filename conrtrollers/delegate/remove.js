const ResponseHandler = require('../../routes/utils/ResponseHandler');
const DelegateService = require('../../services/DelegateService');
const BlockchainService = require('../../services/BlockchainService');

const remove = async (req, res) => {
  try {
    const { did } = req.body;

    // revoco autorizacion en la blockchain
    await BlockchainService.removeDelegate(did);

    // registro revocacion en la bd local
    const { name } = await DelegateService.delete(did);

    return ResponseHandler.sendRes(res, { did, name });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  remove,
};
