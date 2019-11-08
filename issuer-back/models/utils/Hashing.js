const crypto = require("crypto");
const Constants = require("../../constants/Constants");

const genRandomString = function(length) {
	return crypto
		.randomBytes(Math.ceil(length / 2))
		.toString("hex")
		.slice(0, length);
};

var sha512 = function(password, salt) {
	var hash = crypto.createHmac("sha512", salt);
	hash.update(password);
	var value = hash.digest("hex");
	return {
		salt: salt,
		hash: value
	};
};

class Hashing {
	static hash(data) {
		const salt = genRandomString(Constants.SALT_WORK_FACTOR);
		const hashData = sha512(data, salt);
		return { salt: salt, hash: hashData.hash };
	}

	static validateHash(data, hashData) {
		const hashData2 = sha512(data, hashData.salt);
		return hashData2.hash == hashData.hash;
	}
}

module.exports = Hashing;
