const ResponseHandler = require('../../routes/utils/ResponseHandler');
const Image = require('../../models/Image');
const Messages = require('../../constants/Messages');

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await Image.remove(id);

    return ResponseHandler.sendRes(res, Messages.IMAGE.DELETE);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  deleteById,
};
