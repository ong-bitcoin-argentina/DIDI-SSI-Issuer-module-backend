/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const fetch = require('node-fetch');
const { Resolver } = require('did-resolver');
const { SimpleSigner, createJWT, verifyJWT } = require('did-jwt');
const { getResolver } = require('ethr-did-resolver');
const Messages = require('../constants/Messages');
const Register = require('../models/Register');
const Constants = require('../constants/Constants');
const { BLOCKCHAIN_MANAGER_CODES } = require('../constants/Constants');

const {
  INVALID_STATUS,
  GET,
  BLOCKCHAIN,
  EDIT,
  CREATE,
  DID_EXISTS,
  STATUS,
  STATUS_NOT_VALID,
  REFRESH,
  NAME_EXIST,
  INVALID_DID_AND_KEY,
} = Messages.REGISTER.ERR;
const {
  ERROR, ERROR_RENEW, CREATING, REVOKING, REVOKED,
} = Constants.STATUS;
const DISALLOW_WITH_THESE = [CREATING, ERROR, REVOKED, ERROR_RENEW];

const resolver = new Resolver(getResolver(Constants.BLOCKCHAIN.PROVIDER_CONFIG));

const {
  missingDid,
  missingName,
  missingToken,
  missingKey,
  missingFilter,
  missingBody,
} = require('../constants/serviceErrors');

/*
 * Se create un JWT y luego se verifica, para saber si el did y la key estan bien
 * generadas y si la key corresponde a ese did, en caso contrario, el verifyJWT lanza un excepción
 */
const validateDidAndKey = async (did, key) => {
  try {
    const signer = SimpleSigner(key);
    const jwt = await createJWT({}, { alg: 'ES256K-R', issuer: did, signer });

    const options = {
      resolver,
    };

    await verifyJWT(jwt, options);
  } catch (error) {
    const { message } = error;
    console.log(message);

    const code = BLOCKCHAIN_MANAGER_CODES[message.split(':')[0]];
    throw Messages.REGISTER.ERR[code] || INVALID_DID_AND_KEY;
  }
};

const defaultFetch = async function defaultFetch(url, method, body) {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const jsonResp = await response.json();
    if (jsonResp.status === 'error') throw jsonResp;

    return jsonResp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const sendRevokeToDidi = async function sendRevokeToDidi(did, token) {
  return defaultFetch(`${Constants.DIDI_API}/issuer`, 'DELETE', {
    token,
    did,
    callbackUrl: `${Constants.ISSUER_API_URL}/register`,
  });
};

const sendRefreshToDidi = async function sendRefreshToDidi(did, token) {
  return defaultFetch(`${Constants.DIDI_API}/issuer/${did}/refresh`, 'POST', {
    token,
    callbackUrl: `${Constants.ISSUER_API_URL}/register`,
  });
};

const sendEditNameToDidi = async function sendEditNameToDidi(did, name) {
  return defaultFetch(`${Constants.DIDI_API}/issuer/${did}`, 'PUT', { name });
};

const sendDidToDidi = async function sendDidToDidi(did, name, token) {
  return defaultFetch(`${Constants.DIDI_API}/issuer`, 'POST', {
    did,
    name,
    token,
    callbackUrl: `${Constants.ISSUER_API_URL}/register`,
  });
};

// crear un nuevo registro en la blockchain
module.exports.newRegister = async function newRegister(did, key, name, token) {
  if (!did) throw missingDid;
  if (!key) throw missingKey;
  if (!name) throw missingName;
  if (!token) throw missingToken;
  try {
    const blockchain = did.split(':')[2];

    // Verifico si esta bien creado el did y la key
    await validateDidAndKey(did, key);

    // Verifico si la blockchain es correcta
    if (!Constants.BLOCKCHAINS.includes(blockchain)) throw BLOCKCHAIN;

    // Verifico que el did no exista
    const byDIDExist = await Register.getByDID(did);
    if (byDIDExist) throw DID_EXISTS;

    // Verifico que no exista el nombre en una misma blockchain
    const query = { name: { $eq: name }, did: { $regex: blockchain, $options: 'i' } };
    const repeatedRegister = await Register.findOne(query);
    if (repeatedRegister) throw NAME_EXIST;

    // Se envia el did a Didi
    sendDidToDidi(did, name, token);

    const CreateRegister = await Register.generate(did, key, name);
    if (!CreateRegister) throw CREATE;
    return CreateRegister;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// retorna todos los registros
module.exports.getAll = async function getAll(filter) {
  if (!filter) throw missingFilter;
  try {
    return await Register.getAll(filter);
  } catch (err) {
    console.log(err);
    throw GET;
  }
};

module.exports.editRegister = async function editRegister(did, body) {
  if (!did) throw missingDid;
  if (!body) throw missingBody;
  try {
    const register = await Register.getByDID(did);
    if (!register) throw GET;

    const { status, name } = body;
    if (status && !Constants.STATUS_ALLOWED.includes(status)) throw STATUS;

    if (name) await sendEditNameToDidi(did, name);

    return await register.edit(body);
  } catch (err) {
    console.log(err);
    throw EDIT;
  }
};

module.exports.retryRegister = async function retryRegister(did, token) {
  if (!did) throw missingDid;
  if (!token) throw missingToken;
  try {
    const register = await Register.getByDID(did);

    // Verifico que exista el Register
    if (!register) throw GET;

    const { name, status } = register;

    // Verifico que el registro este en estado Error
    if (status !== ERROR) throw INVALID_STATUS;

    // Se envia a DIDI
    sendDidToDidi(did, name, token);

    // Modifico el estado a Pendiente
    return await register.edit({ status: CREATING, messageError: '' });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.refreshRegister = async function refreshRegister(did, token) {
  if (!did) throw missingDid;
  if (!token) throw missingToken;
  try {
    const register = await Register.getByDID(did);

    // Verifico que exista el Register
    if (!register) throw GET;

    const { status } = register;
    if (DISALLOW_WITH_THESE.includes(status)) throw STATUS_NOT_VALID;

    // Se envia a DIDI
    sendRefreshToDidi(did, token);

    // Modifico el estado a Pendiente
    return await register.edit({
      status: CREATING, blockHash: '', messageError: '', expireOn: undefined,
    });
  } catch (err) {
    console.log(err);
    throw REFRESH;
  }
};

module.exports.revoke = async function revoke(did, token) {
  if (!did) throw missingDid;
  if (!token) throw missingToken;
  try {
    const register = await Register.getByDID(did);

    // Verifico que exista el Register
    if (!register) throw GET;

    // Verifico que tenga un estado valido
    const { status } = register;
    if (DISALLOW_WITH_THESE.includes(status)) throw STATUS_NOT_VALID;

    // Se envia el revoke a DIDI
    sendRevokeToDidi(did, token);

    // Modifico el estado a Revocando
    return await register.edit({ status: REVOKING, messageError: '' });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
