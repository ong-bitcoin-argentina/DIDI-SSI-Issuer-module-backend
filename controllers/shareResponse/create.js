const ResponseHandler = require('../../routes/utils/ResponseHandler');
const ShareResponseService = require('../../services/ShareResponseService');

const create = async (req, res) => {
  try {
    const { jwt } = req.body;
    // Guardar el modelo
    await ShareResponseService.create(jwt);
    return ResponseHandler.sendRes(res, 'OK');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErrWithStatus(res, err);
  }
};

module.exports = {
  create,
};
