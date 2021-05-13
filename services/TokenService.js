/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');
const {
  missingUserId,
  missingToken,
} = require('../constants/serviceErrors');

const now = function now() {
  return Math.floor(Date.now() / 1000);
};

// genera token firmado
module.exports.generateToken = function generateToken(userId) {
  if (!userId) throw missingUserId;
  const token = jwt.sign({
    userId,
    exp: now() + 60 * 60 * 60 * 60,
  }, Constants.ISSUER_SERVER_PRIVATE_KEY);
  return token;
};

// valida el token y retorna el userId
module.exports.getTokenData = function getTokenData(token) {
  if (!token) throw missingToken;
  const decoded = jwt.verify(token, Constants.ISSUER_SERVER_PRIVATE_KEY);
  if (decoded.exp && decoded.exp > now()) {
    return {
      userId: decoded.userId,
    };
  }
  throw Error(Messages.VALIDATION.INVALID_TOKEN);
};
