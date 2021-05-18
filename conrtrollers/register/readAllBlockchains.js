const ResponseHandler = require('../../routes/utils/ResponseHandler');
const Constants = require('../../constants/Constants');

const readAllBlockchains = async (req, res) => {
  try {
    return ResponseHandler.sendRes(res, Constants.BLOCKCHAINS);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAllBlockchains,
};
