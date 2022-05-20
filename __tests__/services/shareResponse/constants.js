const jwt = require('jsonwebtoken');

const shareResp = {
  iat: 33,
  type: 'shareResp',
  aud: '0xaud',
  iss: 'did:ethr:firmante',
  exp: 9,
  req: ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjMzLCJ0eXBlIjoic2hhcmVSZXNwIiwiYXVkIjoiMHhhdWQiLCJpc3MiOiJkaWQ6ZXRocjpmaXJtYW50ZSIsImV4cCI6OSwicmVxIjoicmVxIiwidmMiOlt7ImlhdCI6MzMsInR5cGUiOiJzaGFyZVJlc3AiLCJhdWQiOiIweGF1ZCIsImlzcyI6ImRpZDpldGhyOmZpcm1hbnRlIiwic3ViIjoic3ViIiwiY2xhaW0iOnsibmFtZSI6IkNhcm9sIENyeXB0ZWF1IiwiZXNzZW50aWFsIjp0cnVlLCJpc3MiOlt7ImRpZCI6ImRpZDp3ZWI6aWR2ZXJpZmllci5jbGFpbXMiLCJ1cmwiOiJodHRwczovL2lkdmVyaWZpZXIuZXhhbXBsZSJ9XSwicmVhc29uIjoiVG8gbGVnYWxseSBiZSBhYmxlIHRvIHNlbmQgeW91IGEgdGV4dCJ9LCJleHAiOjl9XX0.qysHemTA8JSIVPWMYj6dDoAj7TU1jy4cTwrGKbKL9Rk',
  vc: [
    {
      iat: 16,
      sub: 'did:ethr:0*16',
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
          'Semillas Beneficio': {
            category: 'benefit',
            preview: {
              type: 1,
              fields: ['Caracter', 'Dni Beneficiario'],
              cardLayout: null,
            },
            data: {
              'CERTIFICADO O CURSO': 'Semillas Beneficio',
              'Dni Beneficiario': 'dni ',
              Caracter: 'FAMILIAR',
              NOMBRE: 'Nombre',
              APELLIDO: 'Apellido',
            },
          },
        },
      },
      iss: 'did:ethr:0x16',
    },
  ],
};

const shareRespJWT = jwt.sign(shareResp, 'shareResp');

module.exports = {
  shareRespJWT,
};
