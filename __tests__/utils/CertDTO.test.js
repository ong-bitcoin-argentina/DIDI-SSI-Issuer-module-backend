const { toDTO } = require('../../routes/utils/CertDTO');

const { cert } = require('./constants');

describe('routes/utils/CertDTO - toDTO', () => {
  test('Expect toDTO to success', () => {
    const DTO = toDTO(cert);
    expect(DTO).not.toBe(null);
    expect(DTO.did).toBe(cert.did);
  });
});
