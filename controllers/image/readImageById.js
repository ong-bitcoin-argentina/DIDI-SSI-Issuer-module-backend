const ResponseHandler = require('../../routes/utils/ResponseHandler');
const Image = require('../../models/Image');

const readImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { img, contentType } = await Image.getById(id);
    res.type(contentType);
    return res.send(img);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readImageById,
};
