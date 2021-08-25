const data = {
  did: 'did:ethr:lacchain:0x13a6adef6cbe389685b0582c3c6446bb48fe40a4',
  key: '03ef74a4bd76cbd29db96ab99ae18a064ddfd54f4df49101ffbe9363d6049c93',
  secondDid: 'did:ethr:lacchain:0x042dd636a4b797aa097c5ea9a25f0c8c1f6517b3',
  secondDidKey: 'ee9f7f948def67ce0106aa533fc0082660d6fd45b8f1992a9900d9c06951fce8',
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

module.exports = {
  data,
};
