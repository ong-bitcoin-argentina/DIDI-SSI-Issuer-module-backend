const bcrypt = require('bcrypt');
const Constants = require('../../constants/Constants');

const salt = Constants.HASH_SALT;

// clase utilitaria para hashear utilizando bcrypt
class Hashing {
  // genera un hash utilizando el salt global
  static async hash(data) {
    const hash = await bcrypt.hash(data, salt);
    return { salt, hash };
  }

  // genera un hash utilizando un salt aleatorio
  static async saltedHash(data) {
    const saltRounds = 11;
    const randomSalt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(data, randomSalt);
    return { randomSalt, hash };
  }

  // compara el dato hasheado con el original para validarlo
  static validateHash(data, hashData) {
    return bcrypt.compare(data, hashData.hash);
  }
}

module.exports = Hashing;
