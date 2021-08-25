/* eslint-disable no-underscore-dangle */
const { getBlockchainName } = require('./GetBlockchain');
const { getImageUrl } = require('../../services/utils/imageHandler');

const toDTO = async (register) => {
  const blockchain = getBlockchainName(register);
  const imageUrl = await getImageUrl(register.imageId);

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
    blockchain,
    imageUrl,
  };
};

module.exports = {
  toDTO,
};
