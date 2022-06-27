const { shareRespValidFormat } = require('./constants');
const { validateFormat, validateCredentialClaims, validateIssuer } = require('../../../services/ShareResponseService');
const { ISSUER_SERVER_DID, ISSUER_SERVER_PRIVATE_KEY } = require('../../../constants/Constants');
const { createJWT } = require('../../../services/BlockchainService');
const RegisterModel = require('../../../models/Register');
const {
  SHARE_RES: { ERR },
} = require('../../../constants/Messages');

const serverDid = `did:ethr:${ISSUER_SERVER_DID}`;

describe('services/ShareResponse/validate.test.js', () => {
  let validJWT;
  beforeAll(async () => {
    validJWT = await createJWT(
      serverDid,
      ISSUER_SERVER_PRIVATE_KEY,
      shareRespValidFormat,
      ((new Date().getTime() + 60000)),
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
  });

  test('Expect validateFormat to success', async () => {
    const shareResponse = {
      jwt: validJWT,
      process_status: 'Recibido',
    };
    const shareResponseResult = await validateFormat(shareResponse, true);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateCredentialClaims to success', async () => {
    const shareResponse = {
      jwt: validJWT,
      process_status: 'Recibido',
    };
    const shareResponseResult = await validateCredentialClaims(shareResponse);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateIssuer to success', async () => {
    const shareResponse = {
      jwt: validJWT,
      process_status: 'Recibido',
    };
    RegisterModel.existsIssuer = (() => new Promise((resolve) => {
      resolve(true);
    }));
    const shareResponseResult = await validateIssuer(shareResponse);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateFormat to success', async () => {
    const shareResponse = {
      jwt: validJWT,
      process_status: 'Recibido',
    };
    const shareResponseResult = await validateFormat(shareResponse, true);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateFormat an invalid credential', async () => {
    const invalidJWT = await createJWT(
      serverDid,
      ISSUER_SERVER_PRIVATE_KEY,
      shareRespValidFormat,
      undefined,
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
    const shareResponse = {
      jwt: invalidJWT,
      process_status: 'Recibido',
    };
    try {
      await validateFormat(shareResponse);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_CREDENTIALS_ERROR().code);
    }
  });

  test('Expect validateFormat an invalid aud', async () => {
    shareRespValidFormat.aud = '';
    const invalidJWT = await createJWT(
      serverDid,
      ISSUER_SERVER_PRIVATE_KEY,
      shareRespValidFormat,
      ((new Date().getTime() + 60000)),
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
    const shareResponse = {
      jwt: invalidJWT,
      process_status: 'Recibido',
    };
    try {
      await validateFormat(shareResponse, true);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_JWT.code);
    }
  });

  test('Expect validateFormat an invalid type', async () => {
    shareRespValidFormat.type = '';
    const invalidJWT = await createJWT(
      serverDid,
      ISSUER_SERVER_PRIVATE_KEY,
      shareRespValidFormat,
      ((new Date().getTime() + 60000)),
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
    const shareResponse = {
      jwt: invalidJWT,
      process_status: 'Recibido',
    };
    try {
      await validateFormat(shareResponse, true);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_TYPE.code);
    }
  });

  test('Expect validateCredentialClaims with less VC than claims', async () => {
    shareRespValidFormat.vc.pop();
    const invalidJWT = await createJWT(
      serverDid,
      ISSUER_SERVER_PRIVATE_KEY,
      shareRespValidFormat,
      ((new Date().getTime() + 60000)),
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
    const shareResponse = {
      jwt: invalidJWT,
      process_status: 'Recibido',
    };
    try {
      await validateCredentialClaims(shareResponse);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_CREDENTIALS_DIFERENCE.code);
    }
  });

  test('Expect validateIssuer with invalid issuer', async () => {
    const shareResponse = {
      jwt: validJWT,
      process_status: 'Recibido',
    };
    RegisterModel.existsIssuer = (() => new Promise((resolve) => {
      resolve(false);
    }));
    try {
      await validateIssuer(shareResponse);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_ISSUER_NOT_EXIST.code);
    }
  });
});
