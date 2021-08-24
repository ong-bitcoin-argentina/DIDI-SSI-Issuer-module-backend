const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  img: { type: Buffer, contentType: String },
  contentType: { type: String },
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;

Image.generate = async function generate(buffer, contentType) {
  try {
    const image = new Image();
    image.img = buffer;
    image.contentType = contentType;

    return await image.save();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};

Image.getById = async function getById(id) {
  try {
    const query = { _id: id };
    return await Image.findOne(query);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return Promise.reject(err);
  }
};
