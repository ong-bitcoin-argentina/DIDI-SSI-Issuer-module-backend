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

const shareRespValidFormat = {
  iat: 33,
  type: 'shareResp',
  aud: '0xaud',
  iss: 'did:ethr:firmante',
  exp: 9,
  req: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjMzLCJjYWxsYmFjayI6ImNhbGxiYWNrIiwidHlwZSI6InNoYXJlUmVxIiwiY2xhaW1zIjp7InZlcmlmaWFibGUiOnsibmF0aW9uYWxJZCI6eyJlc3NlbnRpYWwiOnRydWUsImlzc3VlcnMiOlt7ImRpZCI6ImRpZDp3ZWI6aWR2ZXJpZmllci5jbGFpbXMiLCJ1cmwiOiJodHRwczovL2lkdmVyaWZpZXIuZXhhbXBsZSJ9XSwicmVhc29uIjoiVG8gbGVnYWxseSBiZSBhYmxlIHRvIC4uLiJ9LCJlbWFpbE1haW4iOnsiZXNzZW50aWFsIjp0cnVlLCJpc3N1ZXJzIjpbeyJkaWQiOiJkaWQ6d2ViOmlkdmVyaWZpZXIuY2xhaW1zIiwidXJsIjoiaHR0cHM6Ly9pZHZlcmlmaWVyLmV4YW1wbGUifV0sInJlYXNvbiI6IlRvIGxlZ2FsbHkgYmUgYWJsZSB0byAuLi4ifSwibW9iaWxlUGhvbmUiOnsiZXNzZW50aWFsIjp0cnVlLCJpc3N1ZXJzIjpbeyJkaWQiOiJkaWQ6d2ViOmlkdmVyaWZpZXIuY2xhaW1zIiwidXJsIjoiaHR0cHM6Ly9pZHZlcmlmaWVyLmV4YW1wbGUifV0sInJlYXNvbiI6IlRvIGxlZ2FsbHkgYmUgYWJsZSB0byBzZW5kIHlvdSBhIHRleHQifX19LCJhdWQiOiIweGF1ZCIsImlzcyI6ImRpZDpldGhyOmZpcm1hbnRlIn0.U78nL0h-V8hLFgB1SrXw_0zfR3uFGqSHUVAaKqrFzl0',
  vc: [
    {
      iat: 123456789,
      sub: 'did:ethr:0x000',
      vc: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
        ],
        type: [
          'VerifiableCredential',
        ],
        credentialSubject: {
          'Datos Personales': {
            category: 'identity',
            preview: {
              type: 2,
              fields: [
                'Numero de Identidad',
                'Nombre(s)',
                'Apellido(s)',
                'Nacionalidad',
              ],
              cardLayout: null,
            },
            data: {
              Credencial: 'Datos Personales',
              'Nombre(s)': 'Nombre',
              'Apellido(s)': 'Apellido',
              Nacionalidad: 'Nacionalidad',
              'Numero de Identidad': '123456',
            },
          },
        },
      },
      iss: 'did:ethr:0x000',
    },
    {
      iat: 1595346549,
      sub: 'did:ethr:0x3bc78fbf2b14195f8971d6c2551093e52c879b8b',
      vc: {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
        ],
        type: [
          'VerifiableCredential',
        ],
        credentialSubject: {
          Email: {
            preview: {
              type: 0,
              fields: [
                'email',
              ],
            },
            category: 'identity',
            data: {
              email: 'axelbau24@gmail.com',
            },
          },
        },
      },
      iss: 'did:ethr:0x5109e37015c915ca2fd585a4105cf54eabca17f8',
    },
    {
      iat: 1630445692,
      sub: 'did:ethr:0x84b2f1c343176d264a18e9df0ffda8034d777fb6',
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
              phoneNumber: '+542494603286',
            },
          },
        },
      },
      iss: 'did:ethr:0x2b184203babefe306901a76b053bc38659e4a795',
    },
  ],
};

module.exports = {
  shareRespJWT,
  shareRespValidFormat,
};
