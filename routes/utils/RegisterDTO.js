/* eslint-disable no-underscore-dangle */
const { getBlockchainName } = require('./GetBlockchain');

const toDTO = (register) => {
  const blockchain = getBlockchainName(register);

  return {
    _id: register._id,
    did: register.did,
    name: register.name,
    description: register.description,
    imageId: register.imageId,
    expireOn: register.expireOn,
    createdOn: register.createdOn,
    status: register.status,
    messageError: register.messageError,
    blockHash: register.blockHash,
    imageUrl: register.imageUrl,
    blockchain,
  };
};

module.exports = {
  toDTO,
};
