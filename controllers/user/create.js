const ResponseHandler = require('../../routes/utils/ResponseHandler');
const UserService = require('../../services/UserService');

const create = async (req, res) => {
  try {
    const { name, password, profileId } = req.body;
    await UserService.create(name, password, profileId);
    return ResponseHandler.sendRes(res, {});
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
