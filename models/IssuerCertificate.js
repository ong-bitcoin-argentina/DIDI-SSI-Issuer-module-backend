/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const Messages = require('../constants/Messages');

const IssuerCertificateSchema = mongoose.Schema({
  did: {
    type: String,
    required: true,
    unique: true,
  },
  certificate: [{
    createdOn: {
      type: Date,
      default: Date.now(),
    },
    data: [Object],
  }],
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

const IssuerCertificate = mongoose.model('IssuerCertificate', IssuerCertificateSchema);
module.exports = IssuerCertificate;

IssuerCertificate.generate = async function generate(did, data) {
  let issuer;
  try {
    issuer = await IssuerCertificate.findOne({ did });

    if (!issuer) {
      issuer = new IssuerCertificate();
      issuer.did = did;
    }
    issuer.certificate.push({ data });

    issuer = await issuer.save();
    return Promise.resolve(issuer);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

IssuerCertificate.getByDid = async function getByDid(did) {
  try {
    const query = { did };
    const IssuerCert = await IssuerCertificate.findOne(query);
    if (!IssuerCert) throw Messages.SHARE_REQ.ERR.NOT_EXIST;

    return Promise.resolve(IssuerCert);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
