const mongoose = require('mongoose');

const claimsArray = [
  ['emailMain', {
    iss: [
      {
        did: 'did:web:uport.claims',
        url: 'https://uport.claims/email',
      },
      {
        did: 'did:web:sobol.io',
        url: 'https://sobol.io/verify',
      },
    ],
    reason: 'Whe need to be able to email you',
  }],
  ['nationalId', {
    essential: true,
    iss: [
      {
        did: 'did:web:idverifier.claims',
        url: 'https://idverifier.example',
      },
    ],
    reason: 'To legally be able to open your account',
  }],
];

const invalidClaimsArray = [['nationalId', {
  essential: true,
  iss: [
    {
      did: 'did:web:idverifier.claims',
      url: 'https://idverifier.example',
    },
  ],
  reason: 'To legally be able to open your account',
}]];

const claims = new Map(claimsArray);
const invalidClaims = new Map(invalidClaimsArray);

const name = 'ShareRequestName';

const registerId = new mongoose.Types.ObjectId();

module.exports = {
  claims,
  name,
  invalidClaims,
  registerId,
};
