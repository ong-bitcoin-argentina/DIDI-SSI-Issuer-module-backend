const ResponseHandler = require('../../routes/utils/ResponseHandler');
const DelegateService = require('../../services/DelegateService');

const read = async (_, res) => {
  try {
    const delegates = await DelegateService.getAll();
    const result = delegates.map(({ did, name }) => ({ did, name }));
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  read,
};
