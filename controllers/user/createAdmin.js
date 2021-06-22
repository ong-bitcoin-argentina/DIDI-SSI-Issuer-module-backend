const ResponseHandler = require('../../routes/utils/ResponseHandler');
const UserService = require('../../services/UserService');
const Constants = require('../../constants/Constants');

const createAdmin = async (req, res) => {
  try {
    if (!Constants.ENABLE_INSECURE_ENDPOINTS) {
      return ResponseHandler.sendErrWithStatus(res, new Error('Disabled endpoint'), 403);
    }

    const { name, password } = req.body;
    await UserService.createAdmin(name, password);
    return ResponseHandler.sendRes(res, {});
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  createAdmin,
};
