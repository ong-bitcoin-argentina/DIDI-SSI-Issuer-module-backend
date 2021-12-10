const data = {
  did: 'did:ethr:0x45d3e0ea66f13be8b3e5daae4ed5c785bdd5b548',
  key: 'ff0f597a4be7c8de0e62fd2e7dfd2601c04ba0a2f7356414ee5d486662f3d2e0',
  secondDid: 'did:ethr:lacchain:0x042dd636a4b797aa097c5ea9a25f0c8c1f6517b3',
  secondDidKey: 'ee9f7f948def67ce0106aa533fc0082660d6fd45b8f1992a9900d9c06951fce8',
  thirdDid: 'did:ethr:lacchain:0x329b251a016d73f31cc072c64e81a254c4e2a580',
  thirdDidKey: '69fd338c80d2b8f58d779d9eb5478d7307b3e851a064438bfa472a3b787c9c50',

  name: 'Issuer Name',
  secondName: 'Issuer Second Name',
  callbackUrl: 'https://api.issuer.qa.didi.org.ar/register',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGIwZmY3YzM5ZGYxYzAwMzkyNGUxNDgiLCJleHAiOjE2Mzk4NDcxODEsImlhdCI6MTYyNjg4NzE4MX0.dyBtCdKu6lHquDW5VX6q8jTcl2ZIXnq37AV1y1GLk5Y',
  action: 'CREATE',
  description: 'Descripcion del issuer',
  secondDescription: 'Otra descripcion para el issuer',
  file: {
    mimetype: 'image/jpeg',
    path: '__tests__/services/Register/image.jpg',
  },
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

const failureBody = {
  status: 'fail',
  data: {},
};

const errors = {
  did: {
    code: 'DID_EXISTS',
    message: 'Ya existe un registro con ese did.',
  },
  name: {
    code: 'NAME_EXIST',
    message: 'Ya existe el nombre para la misma blockchain.',
  },
};

module.exports = {
  data,
  errors,
  successResp: {
    json: () => successBody,
  },
  failureResp: {
    json: () => failureBody,
  },
};
