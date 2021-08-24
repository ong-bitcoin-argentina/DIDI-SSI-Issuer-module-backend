const fs = require('fs');
const sanitize = require('mongo-sanitize');
const Image = require('../../models/Image');
const { ADDRESS } = require('../../constants/Constants');

const getImageUrl = (imageId) => (imageId ? `${ADDRESS}/uploads/${imageId}` : null);

const createImage = async (path, contentType) => {
  const cleanedPath = sanitize(path);
  const image = fs.readFileSync(cleanedPath);
  const encodedImage = image.toString('base64');
  const buffer = Buffer.from(encodedImage, 'base64');

  const { _id: imageId } = await Image.generate(buffer, contentType);

  return imageId;
};

module.exports = {
  createImage,
  getImageUrl,
};
