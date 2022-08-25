/* eslint-disable no-console */
const { getTranslateFromDidi } = require('./utils/fetchs');

module.exports.getAll = async () => {
  try {
    return await getTranslateFromDidi();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
