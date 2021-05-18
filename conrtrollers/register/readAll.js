const ResponseHandler = require('../../routes/utils/ResponseHandler');
const RegisterDTO = require('../../routes/utils/RegisterDTO');
const RegisterService = require('../../services/RegisterService');

const readAll = async (req, res) => {
  try {
    const registers = await RegisterService.getAll(req.query);
    const result = registers.map((register) => RegisterDTO.toDTO(register));
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAll,
};
