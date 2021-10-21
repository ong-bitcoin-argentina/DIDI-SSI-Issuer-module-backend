/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const {
  ObjectId,
} = mongoose.Types;

const User = require('../models/User');
const Messages = require('../constants/Messages');

const TokenService = require('./TokenService');

const Constants = require('../constants/Constants');
const Profile = require('../models/Profile');

const {
  INVALID_USER,
} = Messages.USER.ERR;

const {
  missingName,
  missingPassword,
  missingUserId,
  missingProfileId,
  missingId,
} = require('../constants/serviceErrors');

// compara las contraseñas y retorna el resultado
module.exports.login = async function login(name, password) {
  if (!name) throw missingName;
  if (!password) throw missingPassword;
  let user;
  try {
    user = await User.getByName(name);
    if (!user) return Promise.reject(Messages.USER.ERR.INVALID_USER);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.USER.ERR.INVALID_USER);
  }

  try {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw INVALID_USER;
    return {
      user,
      token: TokenService.generateToken(user._id),
    };
  } catch (err) {
    console.log(err);
    throw INVALID_USER;
  }
};

// obtener usuario del issuer por id
module.exports.getById = async function getById(userId) {
  if (!userId) throw missingUserId;
  let user;
  try {
    user = await User.getById(userId);
    if (!user) return Promise.reject(Messages.USER.ERR.GET);
    return Promise.resolve(user);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.USER.ERR.GET);
  }
};

// crear usuario para loguearse en el issuer
module.exports.create = async function create(name, password, profileId) {
  if (!name) throw missingName;
  if (!password) throw missingPassword;
  if (!profileId) throw missingProfileId;
  try {
    const profile = await Profile.getById(profileId);
    if (!profile) return Promise.reject(Messages.PROFILE.ERR.GET);

    const user = await User.findOne({
      name: {
        $eq: name,
      },
    });
    if (user) {
      if (!user.deleted) return Promise.reject(Messages.USER.ERR.UNIQUE_NAME);
      return await user.edit({
        name,
        password,
        profile,
        createdOn: Date.now(),
      });
    }

    return await User.generate({
      name,
      password,
      profile,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.USER.ERR.CREATE);
  }
};

// crear usuario admin en el issuer
module.exports.createAdmin = async function createAdmin(name, password) {
  if (!name) throw missingName;
  if (!password) throw missingPassword;
  try {
    const user = await User.findOne({
      name: {
        $eq: name,
      },
    });
    if (user) return Promise.reject(Messages.USER.ERR.UNIQUE_NAME);

    return await User.generate({
      name,
      password,
      isAdmin: true,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.USER.ERR.CREATE);
  }
};

// marca un usuario como borrado
module.exports.delete = async function remove(id) {
  if (!id) throw missingId;
  try {
    let user = await User.findOne({
      _id: ObjectId(id),
      deleted: false,
    });
    if (user.isAdmin) return Promise.reject(Messages.USER.ERR.DELETE);
    user = await user.delete();
    if (!user) return Promise.reject(Messages.USER.ERR.DELETE);
    return Promise.resolve(user);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.USER.ERR.DELETE);
  }
};

// retorna todos los usuarios
module.exports.getAll = async function getAll() {
  try {
    const users = await User.getAll();
    if (!users) return Promise.reject(Messages.USER.ERR.GET);
    return Promise.resolve(users);
  } catch (err) {
    console.log(err);
    return Promise.reject(Messages.USER.ERR.GET);
  }
};

// Edita un usuario y lo retorna
module.exports.edit = async function edit(id, name, password, profileId) {
  if (!id) throw missingId;
  if (!name) throw missingName;
  if (!password) throw missingPassword;
  if (!profileId) throw missingProfileId;
  try {
    if (Constants.COMMON_PASSWORDS.includes(password)) throw Messages.VALIDATION.COMMON_PASSWORD;
    if (password.length < Constants.PASSWORD_MIN_LENGTH) throw Messages.VALIDATION.LENGTH_INVALID('password', 5);

    const profile = await Profile.getById(profileId);
    if (!profile) return Promise.reject(Messages.PROFILE.ERR.GET);

    let user = await User.getById(id);

    if (user.isAdmin) return Promise.reject(Messages.USER.ERR.EDIT);
    user = await user.edit({
      name,
      password,
      profile,
    });

    if (!user) return Promise.reject(Messages.USER.ERR.EDIT);
    return Promise.resolve(user);
  } catch (err) {
    return Promise.reject(err);
  }
};
