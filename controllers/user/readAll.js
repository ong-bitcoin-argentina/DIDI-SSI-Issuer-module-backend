/* eslint-disable no-console */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const UserService = require('../../services/UserService');
const UserDTO = require('../../routes/utils/UserDTO');

const readAll = async (req, res) => {
  try {
    const users = await UserService.getAll();
    const result = users.map((user) => UserDTO.toDTO(user));
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAll,
};
