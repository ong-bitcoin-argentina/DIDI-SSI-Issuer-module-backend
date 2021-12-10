/* eslint-disable no-console */
const {
  BlockchainManager,
} = require('@proyecto-didi/didi-blockchain-manager');
const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');
const Register = require('../models/Register');
const Delegate = require('../models/Delegate');
const {
  missingRegisterId,
  missingOtherDID,
  missingIssuerDid,
  missingPrivateKey,
  missingPayload,
  missingDid,
  missingJwt,
} = require('../constants/serviceErrors');

// Instancia del Blockchain Manager
const config = {
  gasPrice: 10000,
  providerConfig: Constants.BLOCKCHAIN.PROVIDER_CONFIG, // for multiblockchain
};

const blockchainManager = new BlockchainManager(config, Constants.BLOCKCHAIN.GAS_INCREMENT);

/**
 *  Realiza una delegación de "registerId" a "otherDID"
 */
module.exports.addDelegate = async function addDelegate(registerId, otherDID) {
  if (!registerId) throw missingRegisterId;
  if (!otherDID) throw missingOtherDID;
  try {
    const {
      did,
      key: privateKey,
    } = await Register.getCredentials(registerId);
    const credentials = {
      did,
      privateKey,
    };
    // eslint-disable-next-line max-len
    return await blockchainManager.addDelegate(credentials, otherDID, Constants.BLOCKCHAIN.DELEGATE_DURATION);
  } catch (err) {
    console.log(err);
    throw Messages.DELEGATE.ERR.DELEGATE;
  }
};

/**
 * En caso de existir, anula la delegación
 */
module.exports.removeDelegate = async function removeDelegate(otherDID) {
  if (!otherDID) throw missingOtherDID;
  try {
    const {
      register: {
        did,
        private_key: privateKey,
      },
    } = await Delegate.getByDid(otherDID);

    const credentials = {
      did,
      privateKey,
    };

    return await blockchainManager.revokeDelegate(credentials, otherDID);
  } catch (err) {
    console.log(err);
    throw Messages.DELEGATE.ERR.DELETE;
  }
};

/**
 * Retorna true si "registerId" realizo una delegacion de DID a "otherDID"
 */
module.exports.validDelegate = async function validDelegate(registerId, otherDid) {
  if (!registerId) throw missingRegisterId;
  if (!otherDid) throw missingOtherDID;
  try {
    const {
      did,
    } = await Register.getCredentials(registerId);

    return await blockchainManager.validDelegate(did, otherDid);
  } catch (err) {
    console.log(err);
    throw Messages.DELEGATE.ERR.GET_DELEGATE;
  }
};

/**
 * Cenera un certificado asociando la informacion recibida
 */
module.exports.createVerifiableCredential = function createCertificate(
  subjectDid, subjectPayload, expirationDate, issuerDid, issuerPkey,
) {
  if (!issuerDid) throw missingIssuerDid;
  if (!issuerPkey) throw missingPrivateKey;
  if (!subjectPayload) throw missingPayload;
  if (!subjectDid) throw missingDid;
  try {
    return blockchainManager.createCredential(
      subjectDid, subjectPayload, expirationDate, issuerDid, issuerPkey,
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.CERTIFICATE.ERR.CREATE;
  }
};

/**
 * Crea un jwt a partir del payload con la informacion a codificar
 */
module.exports.createJWT = function createJWT(
  issuerDID, privateKey, payload, expiration, audienceDID,
) {
  if (!issuerDID) throw missingIssuerDid;
  if (!privateKey) throw missingPrivateKey;
  if (!payload) throw missingPayload;
  return blockchainManager.createJWT(issuerDID, privateKey, payload, expiration, audienceDID);
};

/**
 * Decodifica un jwt y devuelve su contenido
 */
module.exports.decodeJWT = function decodeJWT(jwt) {
  if (!jwt) throw missingJwt;
  return blockchainManager.decodeJWT(jwt);
};

/**
 * Verifica una credencial
 */
module.exports.verifyCertificate = function verifyCertificate(jwt) {
  if (!jwt) throw missingJwt;
  try {
    return blockchainManager.verifyCredential(jwt);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    throw Messages.CERTIFICATE.ERR.VERIFY;
  }
};

/**
 * Verifica un jwt
 */
module.exports.verifyJWT = async function verifyJWT(jwt, audienceDID) {
  if (!jwt) throw missingJwt;
  return blockchainManager.verifyJWT(jwt, audienceDID);
};

/**
 * Crea una firma valida a partir de la clave privada
 */
module.exports.getSigner = function getSigner(privateKey) {
  if (!privateKey) throw missingPrivateKey;
  return blockchainManager.getSigner(privateKey);
};
