/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const fs = require('fs');
const sanitize = require('mongo-sanitize');
const { ADDRESS } = require('../constants/Constants');
const Messages = require('../constants/Messages');

const ImageSchema = mongoose.Schema({
  img: { type: Buffer, contentType: String },
  contentType: { type: String },
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

// Devuelve al url donde esta guardada la imagen de un issuer segun su imageID
ImageSchema.virtual('imageUrl').get(function imageUrl() {
  return `${ADDRESS}/uploads/${this._id}`;
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;

Image.generate = async function generate(path, contentType) {
  try {
    const cleanedPath = sanitize(path);
    const img = fs.readFileSync(cleanedPath);
    const encodedImage = img.toString('base64');
    const buffer = Buffer.from(encodedImage, 'base64');

    const image = new Image();
    image.img = buffer;
    image.contentType = contentType;

    return image.save();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

Image.getById = async function getById(id) {
  try {
    const query = { _id: id };
    const image = await Image.findOne(query);
    if (!image) throw Messages.IMAGE.ERR.NOT_EXIST;
    return image;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

Image.update = async function update(id, path, contentType) {
  try {
    const query = { _id: { $eq: id } };
    const oldImage = await Image.findOne(query);
    if (!oldImage) throw Messages.IMAGE.ERR.NOT_EXIST;

    const img = fs.readFileSync(path);
    const encodedImage = img.toString('base64');
    const buffer = Buffer.from(encodedImage, 'base64');

    oldImage.img = buffer;
    oldImage.contentType = contentType;

    return oldImage.save();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

Image.remove = async function remove(id) {
  try {
    const image = await Image.findOne({ _id: id });
    if (!image) throw Messages.IMAGE.ERR.NOT_EXIST;

    return image.delete();
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.USER.ERR.DELETE);
  }
};
