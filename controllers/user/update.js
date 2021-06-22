const ResponseHandler = require('../../routes/utils/ResponseHandler');
const UserService = require('../../services/UserService');

const update = async (req, res) => {
  const { profileId, name, password } = req.body;
  const { id } = req.params;

  try {
    await UserService.edit(id, name, password, profileId);
    return ResponseHandler.sendRes(res, {});
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  update,
};
