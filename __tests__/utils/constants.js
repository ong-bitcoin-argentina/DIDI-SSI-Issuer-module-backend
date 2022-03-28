const cert = [{
  data: {
    cert: [
      {
        name: 'Credencial',
        value: 'Datos Personales',
        _id: '623b2b3e362281abbe4f2be2',
      },
      {
        name: 'Nombre(s)',
        value: 'COSME',
        _id: '623b2b3e362281abbe4f2be3',
      },
      {
        name: 'Apellido(s)',
        value: 'FULANITO',
        _id: '623b2b3e362281abbe4f2be4',
      },
      {
        name: 'Nacionalidad',
        value: 'ARGENTINA',
        _id: '623b2b3e362281abbe4f2be5',
      },
      {
        name: 'Numero de Identidad',
        value: '123456789',
        _id: '623b2b3e362281abbe4f2be6',
      },
    ],
    participant: [[
      {
        name: 'DID',
        value: 'did:ethr:0xf7e86a76695493d49ac7ea776bn45ce6bee57b23',
        _id: '623b2b3e362281abbe4f2be7',
      },
      {
        name: 'NAME',
        value: 'COSME',
        _id: '623b2b3e362281abbe4f2be7',
      },
      {
        name: 'LASTNAME',
        value: 'FULANITO',
        _id: '623b2b3e362281abbe4f2be7',
      },
    ]],
    others: [],
  },
  _id: '623b2b3e362281abbe4f2be1',
  split: false,
  deleted: false,
  createdOn: '2022-03-23T14:14:22.098Z',
  microCredentials: [],
  jwts: [],
  templateId: {
    data: { cert: [Array], participant: [Array], others: [] },
    cardLayout: null,
    _id: '62262ce12248912bdc580a36',
    deleted: false,
    createdOn: '2020-06-17T18:05:10.406Z',
    name: 'Datos Personales',
    previewType: '2',
    category: 'IDENTIDAD',
    __v: 0,
    registerId: {
      _id: '61ae3327ab3a470038a029dc',
      deleted: false,
      createdOn: '2021-12-06T15:58:31.956Z',
      status: 'Creado',
      name: 'ShareRequest test',
      description: 'descripcion',
      private_key: 'L9gVPvCVNbG/P08KVFzXC1YBZtOqUgdjnb4LTcgTOHAFEgQw9aj5DecAwqYhYygxZPUENzA3Qni9vArnVIHHQRl4y6fOS9dTelJXai9selGr7F6YK5xTgQT9mYezRl6GWYE6ouhFaDytQpatSN+PPUnyY2ZH6jjC8slsb8ZJMofy8MJ7jf73JVg3+5jIP2mhW1to0LeEKbfbK56I96LJKrdzdHarqzW+vd5bMH0268wN19Q1ryo7vDrFq2UijfVj+AIPNP7vBU2qbhyyRUM22qywH+y5sNvmrYX7S2eYAsT+XgS3guTMC7HNJi7QbMyeK79vQtw4dx19glNQsyWbEQ==',
      did: 'did:ethr:lacchain:0x53eed1f2ad657ad68dc987ab9408c3c890793b35',
      __v: 0,
      expireOn: '2024-11-20T16:00:02.000Z',
    },
    previewData: [
      'Numero de Identidad',
      'Nombre(s)',
      'Apellido(s)',
      'Nacionalidad',
    ],
  },
  __v: 0,
}];

module.exports = {
  cert,
};
