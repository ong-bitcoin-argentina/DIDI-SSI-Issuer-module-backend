const { Credentials } = require('uport-credentials');

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

module.exports = {
  data,
  successResp: {
    json: () => successBody,
  },
};
