const bcrypt = require("bcrypt");
const Constants = require("../../constants/Constants");
const salt = Constants.HASH_SALT;

class Hashing {
	static async hash(data) {
		const hash = await bcrypt.hash(data, salt);
		return { salt: salt, hash: hash };
	}

	static async saltedHash(data) {
		const saltRounds = 11;
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(data, salt);
		return { salt: salt, hash: hash };
	}

	static async validateHash(data, hashData) {
		return await bcrypt.compare(data, hashData.hash);
	}
}

module.exports = Hashing;
