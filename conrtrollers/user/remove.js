const ResponseHandler = require('../../routes/utils/ResponseHandler');
const UserService = require('../../services/UserService');
const UserDTO = require('../../routes/utils/UserDTO');

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserService.delete(id);
    return ResponseHandler.sendRes(res, UserDTO.toDTO(user));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  remove,
};
