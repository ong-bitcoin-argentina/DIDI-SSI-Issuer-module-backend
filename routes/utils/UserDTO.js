/* eslint-disable no-underscore-dangle */
const Constants = require('../../constants/Constants');

const toDTO = (user) => {
  const { profile } = user;
  const types = profile ? profile.types : [];
  if (user.isAdmin) types.push(Constants.USER_TYPES.Admin);
  return {
    _id: user._id,
    name: user.name,
    createdOn: user.createdOn,
    types,
    profile: profile ? profile.name : undefined,
    profileId: profile ? profile._id : undefined,
  };
};

module.exports = {
  toDTO,
};
