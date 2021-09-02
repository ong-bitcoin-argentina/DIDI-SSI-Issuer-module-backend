const sanitize = require('mongo-sanitize');
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const Image = require('../../models/Image');

const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { path, mimetype } = req.file;

    const { img, contentType } = await Image.update(id, sanitize(path), sanitize(mimetype));
    res.type(contentType);
    return res.send(img);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  updateById,
};
