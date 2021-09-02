const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterDTO = require('../../routes/utils/RegisterDTO');
const RegisterService = require('../../services/RegisterService');

const create = async (req, res) => {
  try {
    const {
      did, name, key, description,
    } = req.body;
    const { token } = req.headers;
    const file = req.file && ({ mimetype: req.file.mimetype, path: req.file.path });

    const register = await RegisterService.newRegister(did, key, name, token, description, file);
    return ResponseHandler.sendRes(res, RegisterDTO.toDTO(register));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
