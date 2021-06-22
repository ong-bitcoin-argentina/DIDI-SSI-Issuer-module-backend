const ResponseHandler = require('../../routes/utils/ResponseHandler');
const UserService = require('../../services/UserService');
const UserDTO = require('../../routes/utils/UserDTO');

const validatePassword = async (req, res) => {
  const { name } = req.body;
  const { password } = req.body;
  try {
    const { user, token } = await UserService.login(name, password);
    return ResponseHandler.sendRes(res, { ...UserDTO.toDTO(user), token });
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  validatePassword,
};
