const validShareResponse = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjMzLCJ0eXBlIjoic2hhcmVSZXNwIiwiYXVkIjoiMHhhdWQiLCJpc3MiOiJkaWQ6ZXRocjpmaXJtYW50ZSIsImV4cCI6OSwicmVxIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBZWFFpT2pNekxDSmpZV3hzWW1GamF5STZJbU5oYkd4aVlXTnJJaXdpZEhsd1pTSTZJbk5vWVhKbFVtVnhJaXdpWTJ4aGFXMXpJanA3SW5abGNtbG1hV0ZpYkdVaU9uc2ljMlZ0YVd4c1lWTmxiV0pHWVcxcGJHbGhjaUk2ZXlKbGMzTmxiblJwWVd3aU9uUnlkV1VzSW1semMzVmxjbk1pT2x0N0ltUnBaQ0k2SW1ScFpEcDNaV0k2YVdSMlpYSnBabWxsY2k1amJHRnBiWE1pTENKMWNtd2lPaUpvZEhSd2N6b3ZMMmxrZG1WeWFXWnBaWEl1WlhoaGJYQnNaU0o5WFN3aWNtVmhjMjl1SWpvaVZHOGdiR1ZuWVd4c2VTQmlaU0JoWW14bElIUnZJQzR1TGlKOUxDSnpaVzFwYkd4aFUyRnVZMjl5VTJGc2RXUWlPbnNpWlhOelpXNTBhV0ZzSWpwMGNuVmxMQ0pwYzNOMVpYSnpJanBiZXlKa2FXUWlPaUprYVdRNmQyVmlPbWxrZG1WeWFXWnBaWEl1WTJ4aGFXMXpJaXdpZFhKc0lqb2lhSFIwY0hNNkx5OXBaSFpsY21sbWFXVnlMbVY0WVcxd2JHVWlmVjBzSW5KbFlYTnZiaUk2SWxSdklHeGxaMkZzYkhrZ1ltVWdZV0pzWlNCMGJ5QXVMaTRpZlN3aWJXOWlhV3hsVUdodmJtVWlPbnNpWlhOelpXNTBhV0ZzSWpwMGNuVmxMQ0pwYzNOMVpYSnpJanBiZXlKa2FXUWlPaUprYVdRNmQyVmlPbWxrZG1WeWFXWnBaWEl1WTJ4aGFXMXpJaXdpZFhKc0lqb2lhSFIwY0hNNkx5OXBaSFpsY21sbWFXVnlMbVY0WVcxd2JHVWlmVjBzSW5KbFlYTnZiaUk2SWxSdklHeGxaMkZzYkhrZ1ltVWdZV0pzWlNCMGJ5QnpaVzVrSUhsdmRTQmhJSFJsZUhRaWZYMTlMQ0poZFdRaU9pSXdlR0YxWkNJc0ltbHpjeUk2SW1ScFpEcGxkR2h5T21acGNtMWhiblJsSW4wLlVxZUZVb0hlczEyUzNLUUNaUUVmdEpXbkJqQ1RPeUs2VzhiUjBWMVJHRHciLCJ2YyI6W3siaWF0IjoxNiwic3ViIjoiZGlkOmV0aHI6MHgxNiIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YyIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiU2VtYnJhbmRvIC0gVGl0dWxhciI6eyJjYXRlZ29yeSI6ImJlbmVmaXQiLCJwcmV2aWV3Ijp7InR5cGUiOjEsImZpZWxkcyI6WyJiZW5lZml0SG9sZGVyVHlwZSIsImRuaSJdLCJjYXJkTGF5b3V0IjpudWxsfSwiZGF0YSI6eyJjcmVkZW50aWFsTmFtZSI6IlNlbWJyYW5kbyAtIFRpdHVsYXIiLCJkbmkiOiJkbmkiLCJiZW5lZml0SG9sZGVyVHlwZSI6IkZBTUlMSUFSIiwiZ2l2ZW5OYW1lIjoibm9tYnJlIiwiZmFtaWx5TmFtZSI6ImFwZWxsaWRvIn19fX0sImlzcyI6ImRpZDpldGhyOjB4MTYifV19.7hfaWk1pgdyxktfC3Kd6d3l2ZIpEqhvag6xvkThQFSQ';
const invalidShareResponse = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjMzLCJ0eXBlIjoic2hhcmVSZXNwIiwiYXVkIjoiMHhhdWQiLCJpc3MiOiJkaWQ6ZXRocjpmaXJtYW50ZSIsImV4cCI6OSwicmVxIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBZWFFpT2pNekxDSmpZV3hzWW1GamF5STZJbU5oYkd4aVlXTnJJaXdpZEhsd1pTSTZJbk5vWVhKbFVtVnhJaXdpWTJ4aGFXMXpJanA3SW5abGNtbG1hV0ZpYkdVaU9uc2ljMlZ0YVd4c1lWTmxiV0pHWVcxcGJHbGhjaUk2ZXlKbGMzTmxiblJwWVd3aU9uUnlkV1VzSW1semMzVmxjbk1pT2x0N0ltUnBaQ0k2SW1ScFpEcDNaV0k2YVdSMlpYSnBabWxsY2k1amJHRnBiWE1pTENKMWNtd2lPaUpvZEhSd2N6b3ZMMmxrZG1WeWFXWnBaWEl1WlhoaGJYQnNaU0o5WFN3aWNtVmhjMjl1SWpvaVZHOGdiR1ZuWVd4c2VTQmlaU0JoWW14bElIUnZJQzR1TGlKOUxDSnpaVzFwYkd4aFUyRnVZMjl5VTJGc2RXUWlPbnNpWlhOelpXNTBhV0ZzSWpwMGNuVmxMQ0pwYzNOMVpYSnpJanBiZXlKa2FXUWlPaUprYVdRNmQyVmlPbWxrZG1WeWFXWnBaWEl1WTJ4aGFXMXpJaXdpZFhKc0lqb2lhSFIwY0hNNkx5OXBaSFpsY21sbWFXVnlMbVY0WVcxd2JHVWlmVjBzSW5KbFlYTnZiaUk2SWxSdklHeGxaMkZzYkhrZ1ltVWdZV0pzWlNCMGJ5QXVMaTRpZlN3aWJXOWlhV3hsVUdodmJtVWlPbnNpWlhOelpXNTBhV0ZzSWpwMGNuVmxMQ0pwYzNOMVpYSnpJanBiZXlKa2FXUWlPaUprYVdRNmQyVmlPbWxrZG1WeWFXWnBaWEl1WTJ4aGFXMXpJaXdpZFhKc0lqb2lhSFIwY0hNNkx5OXBaSFpsY21sbWFXVnlMbVY0WVcxd2JHVWlmVjBzSW5KbFlYTnZiaUk2SWxSdklHeGxaMkZzYkhrZ1ltVWdZV0pzWlNCMGJ5QnpaVzVrSUhsdmRTQmhJSFJsZUhRaWZYMTlMQ0poZFdRaU9pSXdlR0YxWkNJc0ltbHpjeUk2SW1ScFpEcGxkR2h5T21acGNtMWhiblJsSW4wLlVxZUZVb0hlczEyUzNLUUNaUUVmdEpXbkJqQ1RPeUs2VzhiUjBWMVJHRHciLCJ2YyI6W3sic3ViIjoiZGlkOmV0aHI6MHgxNiIsInZjIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YyIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiU2VtYnJhbmRvIC0gVGl0dWxhciI6eyJjYXRlZ29yeSI6ImJlbmVmaXQiLCJwcmV2aWV3Ijp7InR5cGUiOjEsImZpZWxkcyI6WyJiZW5lZml0SG9sZGVyVHlwZSIsImRuaSJdLCJjYXJkTGF5b3V0IjpudWxsfSwiZGF0YSI6eyJjcmVkZW50aWFsTmFtZSI6IlNlbWJyYW5kbyAtIFRpdHVsYXIiLCJkbmkiOiJkbmkiLCJiZW5lZml0SG9sZGVyVHlwZSI6IkZBTUlMSUFSIiwiZ2l2ZW5OYW1lIjoibm9tYnJlIiwiZmFtaWx5TmFtZSI6ImFwZWxsaWRvIn19fX0sImlzcyI6ImRpZDpldGhyOjB4MTYifV19.mMFugZn5YC1uEcHW98PhQ-QzidOVWmGB0N4JRYCM3YQ';

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
  shareRespValidFormat,
  validShareResponse,
  invalidShareResponse,
};
