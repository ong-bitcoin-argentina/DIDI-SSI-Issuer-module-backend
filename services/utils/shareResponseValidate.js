const { validateCredential } = require('@proyecto-didi/vc-validator/dist/validator');
const vcSchemas = require('@proyecto-didi/vc-validator/dist/schemas');
const { schemasByName } = require('@proyecto-didi/vc-validator/dist/constants');
const { v1: shareRespSchema } = require('@proyecto-didi/vc-validator/dist/messages/shareResp-schema');
const BlockchainService = require('../BlockchainService');
const RegisterModel = require('../../models/Register');
const DelegateModel = require('../../models/Delegate');
const {
  SHARE_RES: { ERR },
} = require('../../constants/Messages');

const decodeShareResponse = async (shareResponse) => {
  const { payload } = await BlockchainService.decodeJWT(shareResponse.jwt);
  const req = await BlockchainService.decodeJWT(payload.req);
  return { payload, req };
};

const validateFormat = async (shareResponse, payload, verifyJWT = false) => {
  if (!payload.type && payload.type !== 'shareResp') {
    throw ERR.VALIDATION_TYPE;
  }

  if (verifyJWT) {
    try {
      const verified = await BlockchainService.verifyJWT(shareResponse.jwt, payload.aud);
      if (!verified && !verified.payload) throw ERR.VALIDATION_JWT();
    } catch (error) {
      throw ERR.VALIDATION_JWT(error.message);
    }
  }

  const validation = validateCredential(shareRespSchema, shareResponse.jwt);
  if (!validation.status && validation.errors.length) {
    throw ERR.VALIDATION_CREDENTIALS_ERROR(validation.errors.map((e) => e.message));
  }

  return true;
};

const validateCredentialClaims = async (payload, req) => {
  payload.vc.forEach((vc) => {
    Object.entries(vc.vc.credentialSubject).forEach(([key, value]) => {
      const require = Object.entries(vcSchemas[value.category]).find(
        (type) => type[1].v1.properties.vc.properties.credentialSubject.required[0] === key,
      );
      if (!vc.vc.credentialSubject[key] && schemasByName.has(key)
      && !req.payload.claims.verifiable[require[0]]) {
        throw ERR.VALIDATION_CREDENTIALS_NOT_CLAIMED(key);
      }
    });
  });
  if (Object.entries(req.payload.claims.verifiable).length !== payload.vc.length) {
    throw ERR.VALIDATION_CREDENTIALS_DIFERENCE;
  }

  return true;
};

const validateIssuer = async (payload, req) => {
  const callsIssuerModel = [];
  Object.entries(req.payload.claims.verifiable).forEach(([, claim]) => {
    Object.entries(claim.issuers).forEach(([, issuer]) => {
      callsIssuerModel.push(RegisterModel.existsIssuer(issuer.did));
    });
  });
  const callsIssuerModelResult = await Promise.all(callsIssuerModel);
  if (callsIssuerModelResult.some((result) => result === false)) {
    throw ERR.VALIDATION_ISSUER_NOT_EXIST;
  }

  return true;
};

const validateEmitter = async (payload) => {
  const callsDelegateModel = [];
  Object.entries(payload.vc).forEach(([, vc]) => {
    callsDelegateModel.push(DelegateModel.findOne({ did: vc.iss }));
  });
  const callsDelegateModelResult = await Promise.all(callsDelegateModel);
  if (callsDelegateModelResult.some((result) => result === null)) {
    throw ERR.VALIDATION_ISSUER_IS_NOT_DELEGATE;
  }

  return true;
};

module.exports = {
  decodeShareResponse,
  validateFormat,
  validateCredentialClaims,
  validateIssuer,
  validateEmitter,
};
