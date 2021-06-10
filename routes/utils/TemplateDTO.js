const pick = require('lodash.pick');
const { getBlockchainName } = require('./GetBlockchain');

const getRegisterId = (template) => getBlockchainName(template.registerId);

const toDTO = (templates) => templates.map((template) => ({
  ...pick(template, ['createdOn', 'name', '_id']),
  blockchain: getRegisterId(template),
}));

module.exports = {
  toDTO,
};
