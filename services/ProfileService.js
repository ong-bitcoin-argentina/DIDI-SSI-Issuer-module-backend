/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { missingId, missingBody } = require('../constants/serviceErrors');

const { TYPE } = Messages.USER.ERR;
const { GET, IS_USED, NAME_NOT_UNIQUE } = Messages.PROFILE.ERR;
const { USER_CREATED_TYPES } = Constants;

const validateTypes = (types) => {
  if (!USER_CREATED_TYPES.some((t) => types.includes(t))) throw TYPE;
};

module.exports.createProfile = async (body) => {
  if (!body) throw missingBody;
  try {
    const { types, name } = body;

    // Valido que los tipos de permisos son correctos
    validateTypes(types);

    // Valido que el nombre no exista, y si existe y esta como borrado, lo edito
    const profile = await Profile.getByName(name);
    if (profile) {
      if (!profile.deleted) throw NAME_NOT_UNIQUE;
      return await profile.edit({ ...body, deleted: false });
    }

    return await Profile.generate(body);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.getAllProfiles = async () => {
  try {
    return await Profile.getAll();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.editProfile = async (id, body) => {
  if (!id) throw missingId;
  if (!body) throw missingBody;
  try {
    const { types } = body;

    // Valido que los tipos de permisos son correctos
    validateTypes(types);

    // Valido que exista el perfil
    const profile = await Profile.getById(id);
    if (!profile) throw GET;

    return await profile.edit(body);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports.delete = async (id) => {
  if (!id) throw missingId;
  try {
    const users = await User.getAllByProfile(id);

    if (users.length > 0) {
      const names = users.map((user) => user.name);
      throw { ...IS_USED, message: `${IS_USED.message} ${names}` };
    }

    // Valido que exista el perfil
    const profile = await Profile.getById(id);
    if (!profile) throw GET;

    return await profile.delete();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
