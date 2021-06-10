/* eslint-disable no-underscore-dangle */
const Constants = require('../../constants/Constants');
const { BLOCK_CHAIN_DEFAULT } = require('../../constants/Constants');

/**
 * Se obtiene el nombre de la blockchain a travez de un Registro,
 * si este no cuenta con una blockchain, se devuelta la default
 */

const getBlockchainName = (register) => {
  let blockchain_ = BLOCK_CHAIN_DEFAULT;
  if (register) {
    const split = register.did.split(':');
    const blockchain = split[2];
    if (Constants.BLOCKCHAINS.includes(blockchain)) blockchain_ = blockchain;
  }
  return blockchain_;
};

module.exports = {
  getBlockchainName,
};
