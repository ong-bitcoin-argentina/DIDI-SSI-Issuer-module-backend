/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const { ObjectId } = mongoose;

const DefaultValuesSchema = mongoose.Schema({
  registerId: {
    type: ObjectId,
    ref: 'Register',
  },
  templateId: {
    type: ObjectId,
    required: true,
    ref: 'Template',
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

DefaultValuesSchema.index({ registerId: 1 });

DefaultValuesSchema.methods.edit = async function edit(data) {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: data,
  };

  try {
    return await DefaultValues.findOneAndUpdate(updateQuery, updateAction);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const DefaultValues = mongoose.model('DefaultValues', DefaultValuesSchema);
module.exports = DefaultValues;

// crea un nuevo default
DefaultValues.generate = async function generate(body) {
  try {
    const default_ = await DefaultValues.create(body);

    return await default_.save();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

DefaultValues.get = async function get() {
  try {
    const query = { deleted: false };
    const defaults = await DefaultValues.find(query);

    return Promise.resolve(defaults[0]);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
