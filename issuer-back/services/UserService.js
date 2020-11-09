const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const User = require("../models/User");
const Messages = require("../constants/Messages");

const TokenService = require("./TokenService");

const { toDTO } = require("../routes/utils/UserDTO");
const Constants = require("../constants/Constants");

// compara las contraseñas y retorna el resultado
module.exports.login = async function (name, password) {
	let user;
	try {
		user = await User.findOne({ name: name, deleted: false });
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
		user = await User.findOne({ _id: ObjectId(userId), deleted: false });
		if (!user) return Promise.reject(Messages.USER.ERR.GET);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.GET);
	}
};

// crear usuario para loguearse en el issuer
module.exports.create = async function (name, password, type) {
	try {
		if (!Constants.USER_TYPES[type]) return Promise.reject(Messages.USER.ERR.TYPE);
		const user = await User.generate(name, password, type);
		if (!user) return Promise.reject(Messages.USER.ERR.CREATE);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.CREATE);
	}
};

// marca un usuario como borrado
module.exports.delete = async function (id) {
	try {
		let user = await User.findOne({ _id: ObjectId(id), deleted: false });
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
module.exports.edit = async function (id, name, password, type) {
	try {
		if (!Constants.USER_TYPES[type]) return Promise.reject(Messages.USER.ERR.TYPE);
		let user = await this.getById(id);
		user = await user.edit(name, password, type);
		if (!user) return Promise.reject(Messages.USER.ERR.EDIT);
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.USER.ERR.EDIT);
	}
};
