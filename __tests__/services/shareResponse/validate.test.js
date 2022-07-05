const { shareRespValidFormat, invalidShareResponse } = require('./constants');
const {
  validateFormat,
  validateCredentialClaims,
  validateIssuer,
  validateEmitter,
  saveIssuerCertificate,
} = require('../../../services/ShareResponseService');
const { ISSUER_SERVER_DID, ISSUER_SERVER_PRIVATE_KEY } = require('../../../constants/Constants');
const { createJWT, decodeJWT } = require('../../../services/BlockchainService');
const RegisterModel = require('../../../models/Register');
const DelegateModel = require('../../../models/Delegate');
const IssuerCertificateModel = require('../../../models/IssuerCertificate');

const {
  SHARE_RES: { ERR },
} = require('../../../constants/Messages');

const serverDid = `did:ethr:${ISSUER_SERVER_DID}`;

describe('services/ShareResponse/validate.test.js', () => {
  let validJWT;
  let validJWTPayload;
  let validReqDecoded;
  beforeAll(async () => {
    validJWT = await createJWT(
      serverDid,
      ISSUER_SERVER_PRIVATE_KEY,
      shareRespValidFormat,
      ((new Date().getTime() + 60000)),
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
    const { payload } = await decodeJWT(validJWT);
    validJWTPayload = payload;
    validReqDecoded = await decodeJWT(validJWTPayload.req);
  });

  test('Expect validateFormat to success', async () => {
    expect.assertions(1);
    const shareResponse = {
      jwt: validJWT,
      process_status: 'Recibido',
    };
    const shareResponseResult = await validateFormat(shareResponse, validJWTPayload, true);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateCredentialClaims to success', async () => {
    expect.assertions(1);
    const shareResponseResult = await validateCredentialClaims(validJWTPayload, validReqDecoded);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateIssuer to success', async () => {
    expect.assertions(1);
    RegisterModel.existsIssuer = (() => Promise.resolve(true));

    const shareResponseResult = await validateIssuer(validReqDecoded);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect saveIssuerCertificate to success', async () => {
    expect.assertions(1);
    IssuerCertificateModel.generate = (() => new Promise((resolve) => {
      resolve(true);
    }));
    const shareResponseResult = await saveIssuerCertificate(validJWTPayload);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect saveIssuerCertificate without Certificates to success', async () => {
    expect.assertions(1);
    IssuerCertificateModel.generate = (() => new Promise(() => {
      // eslint-disable-next-line no-throw-literal
      throw 'Error do not must call model';
    }));
    validJWTPayload.vc = [];
    const shareResponseResult = await saveIssuerCertificate(validJWTPayload);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateEmitter to success', async () => {
    expect.assertions(1);
    DelegateModel.findOne = (() => Promise.resolve(true));
    const shareResponseResult = await validateEmitter(validJWTPayload);
    expect(shareResponseResult).toBe(true);
  });

  test('Expect validateFormat an invalid credential', async () => {
    expect.assertions(1);
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
      const { payload } = await decodeJWT(invalidJWT);
      await validateFormat(shareResponse, payload);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_CREDENTIALS_ERROR().code);
    }
  });

  test('Expect validateFormat an invalid aud', async () => {
    expect.assertions(1);
    const shareResponse = {
      jwt: invalidShareResponse,
      process_status: 'Recibido',
    };
    try {
      const { payload } = await decodeJWT(invalidShareResponse);
      await validateFormat(shareResponse, payload, true);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_JWT().code);
    }
  });

  test('Expect validateFormat an invalid type', async () => {
    expect.assertions(1);
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
      const { payload } = await decodeJWT(invalidJWT);
      await validateFormat(shareResponse, payload, true);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_TYPE.code);
    }
  });

  test('Expect validateCredentialClaims with less VC than claims', async () => {
    expect.assertions(1);
    shareRespValidFormat.vc.pop();
    const invalidJWT = await createJWT(
      serverDid,
      ISSUER_SERVER_PRIVATE_KEY,
      shareRespValidFormat,
      ((new Date().getTime() + 60000)),
      'id:ethr:lacchain:0x36f6dc06d34b164aec5421c9071a0d07765d4ee1',
    );
    try {
      const { payload } = await decodeJWT(invalidJWT);
      const req = await decodeJWT(payload.req);
      await validateCredentialClaims(payload, req);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_CREDENTIALS_DIFERENCE.code);
    }
  });

  test('Expect validateIssuer with invalid issuer', async () => {
    expect.assertions(1);
    RegisterModel.existsIssuer = (() => Promise.resolve(false));
    try {
      await validateIssuer(validReqDecoded);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_ISSUER_NOT_EXIST.code);
    }
  });

  test('Expect validateEmitter with invalid delegate', async () => {
    expect.assertions(1);
    DelegateModel.findOne = (() => Promise.resolve(null));
    try {
      await validateEmitter(validJWTPayload);
    } catch (e) {
      expect(e.code).toMatch(ERR.VALIDATION_ISSUER_IS_NOT_DELEGATE.code);
    }
  });
});
