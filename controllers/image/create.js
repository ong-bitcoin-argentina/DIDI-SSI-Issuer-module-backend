const ResponseHandler = require('../../routes/utils/ResponseHandler');
const Image = require('../../models/Image');

const create = async (req, res) => {
  try {
    const { path, mimetype } = req.file;

    const { _id: imageId } = await Image.generate(path, mimetype);

    return ResponseHandler.sendRes(res, imageId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  create,
};
