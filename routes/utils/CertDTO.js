/* eslint-disable no-underscore-dangle */
const { getBlockchainName } = require('./GetBlockchain');

const getDID = (cert) => cert.data.participant[0][0].value;

const parse = (cert) => {
  const register = cert.templateId ? cert.templateId.registerId : undefined;
  const blockchain = getBlockchainName(register);
  const certificate = {
    _id: cert._id,
    name: cert.data.cert[0].value,
    did: getDID(cert),
    createdOn: cert.createdOn,
    revocation: cert.revocation,
    emmitedOn: cert.emmitedOn,
    blockchain,
  };
  // Se asume que los campos del arreglo de datos de participante en 1 y 2 son nombre y apellido
  if (cert.data.participant[0].length > 2) {
    certificate.firstName = cert.data.participant[0][1].value;
    certificate.lastName = cert.data.participant[0][2].value;
  }
  return certificate;
};

const toDTO = (certs) => certs.map(parse);

module.exports = {
  toDTO,
  getDID,
};
