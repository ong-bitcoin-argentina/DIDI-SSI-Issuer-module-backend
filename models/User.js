/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const Hashing = require('./utils/Hashing');
const HashedData = require('./dataTypes/HashedData');

const { ObjectId } = mongoose;

// Usuario para loguearse en el issuer
// (de momento solo sirve para eso)
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: HashedData,
  profile: {
    type: ObjectId,
    ref: 'Profile',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.index({ name: 1 });

// verifica la clave
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  try {
    const result = Hashing.validateHash(candidatePassword, this.password);
    return Promise.resolve(result);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// actualiza la clave
UserSchema.methods.updatePassword = async function updatePassword(password) {
  const hashData = await Hashing.saltedHash(password);

  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { password: hashData, modifiedOn: new Date() },
  };

  try {
    await User.findOneAndUpdate(updateQuery, updateAction);
    this.password = hashData;
    return Promise.resolve(this);
  } catch (err) {
    return Promise.reject(err);
  }
};

// marca usuario como borrado
// eslint-disable-next-line func-names
UserSchema.methods.delete = async function () {
  const updateQuery = { _id: this._id };
  const updateAction = {
    $set: { deleted: true },
  };

  try {
    await User.findOneAndUpdate(updateQuery, updateAction);
    this.deleted = true;
    return Promise.resolve(this);
  } catch (err) {
    return Promise.reject(err);
  }
};

// edita un usuario
UserSchema.methods.edit = async function edit({
  name, password, profile, deleted = false, createdOn,
}) {
  const updateQuery = { _id: this._id };
  const setQuery = { name, profile, deleted };

  if (password) setQuery.password = await Hashing.saltedHash(password);
  if (createdOn) setQuery.createdOn = createdOn;

  const updateAction = {
    $set: setQuery,
  };

  try {
    const user = await User.findOneAndUpdate(updateQuery, updateAction);
    return Promise.resolve(user);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const User = mongoose.model('User', UserSchema);
module.exports = User;

// crea un nuevo usuario
User.generate = async function generate({
  name, password, profile, isAdmin,
}) {
  let user;
  try {
    const query = { name, deleted: false };
    user = await User.findOne(query);

    if (!user) user = new User();

    user.password = await Hashing.saltedHash(password);
    user.name = name;
    user.deleted = false;
    user.createdOn = new Date();
    if (profile) user.profile = profile;
    if (isAdmin) user.isAdmin = isAdmin;

    user = await user.save();
    return Promise.resolve(user);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// obtener todos los usuarios
User.getAll = async function getAll() {
  try {
    const query = { deleted: false };
    const users = await User.find(query).populate('profile').sort({ createdOn: -1 });
    return Promise.resolve(users);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

User.getById = async function getById(userId) {
  try {
    return await User.findOne({ _id: userId, deleted: false }).populate('profile');
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

User.getByName = async function getByName(name) {
  try {
    return await User.findOne({ name, deleted: false }).populate('profile');
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

User.getAllByProfile = async function getAllByProfile(profileId) {
  try {
    return await User.find({ deleted: false, profile: profileId });
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
