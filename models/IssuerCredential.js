/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const Messages = require('../constants/Messages');

const IssuerCredentialSchema = mongoose.Schema({
  did: {
    type: String,
    required: true,
    unique: true,
  },
  credential: [{
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

const IssuerCredential = mongoose.model('IssuerCredential', IssuerCredentialSchema);
module.exports = IssuerCredential;

IssuerCredential.generate = async function generate(did, data) {
  let issuer;
  try {
    issuer = await IssuerCredential.findOne({ did });

    if (!issuer) {
      issuer = new IssuerCredential();
      issuer.did = did;
    }
    issuer.credential.push({ data });

    issuer = await issuer.save();
    return Promise.resolve(issuer);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

IssuerCredential.getByDid = async function getByDid(did) {
  try {
    const query = { did };
    const IssuerCert = await IssuerCredential.findOne(query);
    if (!IssuerCert) throw Messages.SHARE_REQ.ERR.NOT_EXIST;

    return Promise.resolve(IssuerCert);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

IssuerCredential.searchCredentials = async function searchCredentials(term) {
  try {
    const query = {
      $or: [
        { 'credential.data.Nombre(s)': { $regex: term, $options: 'i' } },
        { 'credential.data.Apellido(s)': { $regex: term, $options: 'i' } },
        { 'credential.data.Numero de Identidad': { $regex: term, $options: 'i' } },
        { 'credential.data.email': { $regex: term, $options: 'i' } },
        { 'credential.data.phoneNumber': { $regex: term, $options: 'i' } },
      ],
    };
    const IssuerCerts = await IssuerCredential.find(query);
    if (!IssuerCerts) throw Messages.SHARE_REQ.ERR.NOT_EXIST;

    return Promise.resolve(IssuerCerts);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
