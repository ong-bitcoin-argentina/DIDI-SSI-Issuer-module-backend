const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const User = require("../models/User");
const Messages = require("../constants/Messages");

const TokenService = require("./TokenService");

const { toDTO } = require("../routes/utils/UserDTO");
const Constants = require("../constants/Constants");
const Profile = require("../models/Profile");

// compara las contraseñas y retorna el resultado
module.exports.login = async function (name, password) {
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
		if (!isMatch) return Promise.reject(Messages.USER.ERR.INVALID_USER);
		const userResponse = toDTO(user);
		return Promise.resolve({ ...userResponse, token: TokenService.generateToken(user._id) });
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.INVALID_USER);
	}
};

// obtener usuario del issuer por id
module.exports.getById = async function (userId) {
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
module.exports.create = async function (name, password, profileId) {
	try {
		const profile = await Profile.getById(profileId);
		if (!profile) return Promise.reject(Messages.PROFILE.ERR.GET);

		const user = await User.findOne({ name });
		if (user) {
			if (!user.deleted) return Promise.reject(Messages.USER.ERR.UNIQUE_NAME);
			return await user.edit({ name, password, profile });
		}

		return await User.generate({ name, password, profile });
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.CREATE);
	}
};

// crear usuario admin en el issuer
module.exports.createAdmin = async function (name, password) {
	try {
		const user = await User.findOne({ name });
		if (user) return Promise.reject(Messages.USER.ERR.UNIQUE_NAME);

		return await User.generate({ name, password, isAdmin: true });
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.CREATE);
	}
};

// marca un usuario como borrado
module.exports.delete = async function (id) {
	try {
		let user = await User.findOne({ _id: ObjectId(id), deleted: false });
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
module.exports.getAll = async function () {
	try {
		let users = await User.getAll();
		if (!users) return Promise.reject(Messages.USER.ERR.GET);
		return Promise.resolve(users);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.GET);
	}
};

// Edita un usuario y lo retorna
module.exports.edit = async function (id, name, password, profileId) {
	try {
		const profile = await Profile.getById(profileId);
		if (!profile) return Promise.reject(Messages.PROFILE.ERR.GET);

		let user = await User.getById(id);

		if (user.isAdmin) return Promise.reject(Messages.USER.ERR.EDIT);
		user = await user.edit({ name, password, profile });

		if (!user) return Promise.reject(Messages.USER.ERR.EDIT);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.EDIT);
	}
};
