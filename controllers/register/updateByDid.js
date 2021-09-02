const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterDTO = require('../../routes/utils/RegisterDTO');
const RegisterService = require('../../services/RegisterService');

const updateByDid = async (req, res) => {
  try {
    const { did } = req.params;
    const file = req.file && ({ mimetype: req.file.mimetype, path: req.file.path });

    const register = await RegisterService.editRegister(did, req.body, file);
    return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateByDid,
};
