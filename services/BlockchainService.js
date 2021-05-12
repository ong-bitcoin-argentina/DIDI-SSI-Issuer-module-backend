/* eslint-disable no-console */
const {
  BlockchainManager,
} = require('@proyecto-didi/didi-blockchain-manager');
const Constants = require('../constants/Constants');
const Messages = require('../constants/Messages');
const Register = require('../models/Register');
const Delegate = require('../models/Delegate');
const { missingRegisterId, missingOtherDID } = require('../constants/serviceErrors');

// Instancia del Blockchain Manager
const config = {
  gasPrice: 10000,
  providerConfig: Constants.BLOCKCHAIN.PROVIDER_CONFIG, // for multiblockchain
};

const blockchainManager = new BlockchainManager(config, Constants.BLOCKCHAIN.GAS_INCREMENT);

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

// anula la delegacion de "userDID" a "otherDID" de existir esta
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

// retorna true si "userDID" realizo una delegacion de DID a "otherDID"
module.exports.validDelegate = async function validDelegate(registerId, otherDid) {
  if (!registerId) throw missingRegisterId;
  if (!otherDid) throw missingOtherDID;
  try {
    const {
      did,
    } = await Register.getCredentials(registerId);

    return await blockchainManager.validateDelegate(did, otherDid);
  } catch (err) {
    console.log(err);
    throw Messages.DELEGATE.ERR.GET_DELEGATE;
  }
};
