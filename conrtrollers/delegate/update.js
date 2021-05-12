const ResponseHandler = require('../../routes/utils/ResponseHandler');
const BlockchainService = require('../../services/BlockchainService');

const update = async (req, res) => {
  try {
    const { didDelegate, registerId } = req.body;

    // seteo el nombre en la blockchain
    const result = await BlockchainService.validDelegate(registerId, didDelegate);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  update,
};
