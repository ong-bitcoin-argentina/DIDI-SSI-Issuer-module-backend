const NodeRSA = require("node-rsa");
const Constants = require("../../constants/Constants");
const key = new NodeRSA(Constants.RSA_PRIVATE_KEY);

const Hashing = require("./Hashing");

class Encrypt {
	static async encrypt(data) {
		const encrypted = key.encrypt(data, "base64");
		return encrypted;
	}

	static async decript(encrypted) {
		const data = key.decrypt(encrypted, "utf8");
		return data;
	}

	static async setEncryptedData(model, name, data) {
		try {
			const encrypted = await Encrypt.encrypt(data);
			model[name] = encrypted;
			return Promise.resolve(model);
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
	}

	static async getEncryptedData(model, name) {
		try {
			const encrypted = model[name];
			const data = await Encrypt.decript(encrypted);
			return Promise.resolve(data);
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
	}
}

module.exports = Encrypt;
