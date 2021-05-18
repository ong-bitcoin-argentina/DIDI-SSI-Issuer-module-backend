const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterDTO = require('../../routes/utils/RegisterDTO');
const RegisterService = require('../../services/RegisterService');

const removeByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const { token } = req.headers;
    const register = await RegisterService.revoke(did, token);
    return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  removeByDid,
};
