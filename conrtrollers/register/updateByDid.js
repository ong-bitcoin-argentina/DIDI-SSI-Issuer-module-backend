const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterDTO = require('../../routes/utils/RegisterDTO');
const RegisterService = require('../../services/RegisterService');

const updateByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const register = await RegisterService.editRegister(did, req.body);
    return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateByDid,
};
