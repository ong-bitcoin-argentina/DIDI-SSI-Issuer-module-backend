const { Credentials } = require('uport-credentials');
const jwt = require('jsonwebtoken');

const { did, privateKey } = Credentials.createIdentity();

const data = {
  did,
  privateKey,
  name: 'name',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGIwZmY3YzM5ZGYxYzAwMzkyNGUxNDgiLCJleHAiOjE2Mzk4NDcxODEsImlhdCI6MTYyNjg4NzE4MX0.dyBtCdKu6lHquDW5VX6q8jTcl2ZIXnq37AV1y1GLk5Y',
};

const successBody = {
  status: 'success',
  data: {
    _id: '60d379508d84ce00159c02da',
    did: data.did,
    name: data.name,
    action: 'CREATE',
    __v: 0,
  },
};

const payload = {
  iat: 123,
  sub: 'did:ethr:123',
  exp: 123,
  vc: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
    ],
    type: [
      'VerifiableCredential',
    ],
    credentialSubject: {
      Phone: {
        preview: {
          type: 0,
          fields: [
            'phoneNumber',
          ],
        },
        category: 'identity',
        data: {
          phoneNumber: '+123',
        },
      },
    },
  },
  iss: 'did:ethr:123',
};

const dataVerifyCred = jwt.sign(payload, 'test');

const successBodyVerifyCred = {
  status: 'success',
  data: {
    payload,
    doc: {
      '@context': 'https://w3id.org/did/v1',
      id: 'id',
      publicKey: [
        {
          id: 'id',
          type: 'type',
          controller: 'controller',
          ethereumAddress: 'ethAddress',
        },
      ],
      authentication: [
        {
          type: 'type',
          publicKey: 'key',
        },
      ],
    },
    issuer: 'DIDI Server QA',
    signer: {
      id: 'id',
      type: 'type',
      controller: 'controller',
      ethereumAddress: 'ethAddress',
    },
    jwt: dataVerifyCred,
    status: 'UNVERIFIED',
  },
};

module.exports = {
  data,
  dataVerifyCred,
  successResp: {
    json: () => successBody,
  },
  successRespVerifyCred: {
    json: () => successBodyVerifyCred,
  },
};
