/* eslint-disable max-len */
const Template = require('../../models/Template');
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const TokenService = require('../../services/TokenService');
const { getDID } = require('../../routes/utils/CertDTO');

const removeById = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const { token } = req.headers;

  try {
    const { userId } = TokenService.getTokenData(token);
    const cert = await CertService.deleteOrRevoke(id, reason, userId);
    const { registerId } = await Template.findById(cert.templateId);
    const did = getDID(cert);
    const calls = cert.jwts.map((jwt) => MouroService.revokeCertificate(jwt.data, jwt.hash, did, registerId));
    await Promise.all(calls);
    return ResponseHandler.sendRes(res, cert);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  removeById,
};
