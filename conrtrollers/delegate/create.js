const ResponseHandler = require('../../routes/utils/ResponseHandler');
const DelegateService = require('../../services/DelegateService');
const BlockchainService = require('../../services/BlockchainService');

const create = async (req, res) => {
  try {
    const { name, did, registerId } = req.body;

    // autorizo en la blockchain
    await BlockchainService.addDelegate(registerId, did);

    // registro autorizacion en la bd local
    await DelegateService.create(did, name, registerId);

    return ResponseHandler.sendRes(res, { did, name });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
