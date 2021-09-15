/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
const assert = require('assert');
// General
const DEBUGG = process.env.DEBUGG_MODE == 'true';
const ENABLE_INSECURE_ENDPOINTS = process.env.ENABLE_INSECURE_ENDPOINTS == 'true';
const {
  VERSION, NAME, ISSUER_API_URL, ADDRESS,
  PORT, FULL_URL, RSA_PRIVATE_KEY, HASH_SALT, DIDI_API,
} = process.env;

assert.ok(NAME, 'No esta definida la varibale NAME');
assert.ok(VERSION, 'No esta definida la varibale VERSION');
assert.ok(ISSUER_API_URL, 'No esta definida la varibale ISSUER_API_URL');
assert.ok(HASH_SALT, 'No esta definida la varibale HASH_SALT');
assert.ok(ADDRESS, 'No esta definida la varibale ADDRESS');
assert.ok(PORT, 'No esta definida la varibale PORT');
assert.ok(FULL_URL, 'No esta definida la varibale FULL_URL');
assert.ok(RSA_PRIVATE_KEY, 'No esta definida la varibale RSA_PRIVATE_KEY');
assert.ok(DIDI_API, 'No esta definida la varibale DIDI_API');

// Blockchain
const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || '1300000';
const SET_ATTRIBUTE = process.env.BLOCK_CHAIN_SET_ATTRIBUTE || '999999999';
const GAS_INCREMENT = process.env.GAS_INCREMENT || '1.1';

const { BLOCKCHAIN_URL_RSK, BLOCKCHAIN_URL_LAC, BLOCKCHAIN_URL_BFA } = process.env;
const { BLOCKCHAIN_CONTRACT_MAIN, BLOCKCHAIN_CONTRACT_LAC, BLOCKCHAIN_CONTRACT_BFA } = process.env;
const { INFURA_KEY } = process.env;

assert.ok(BLOCKCHAIN_URL_RSK, 'No esta definida la varibale BLOCKCHAIN_URL_RSK');
assert.ok(BLOCKCHAIN_URL_LAC, 'No esta definida la varibale BLOCKCHAIN_URL_LAC');
assert.ok(BLOCKCHAIN_URL_BFA, 'No esta definida la varibale BLOCKCHAIN_URL_BFA');

assert.ok(BLOCKCHAIN_CONTRACT_MAIN, 'No esta definida la varibale BLOCKCHAIN_CONTRACT_MAIN');
assert.ok(BLOCKCHAIN_CONTRACT_LAC, 'No esta definida la varibale BLOCKCHAIN_CONTRACT_LAC');
assert.ok(BLOCKCHAIN_CONTRACT_BFA, 'No esta definida la varibale BLOCKCHAIN_CONTRACT_BFA');

// MongoDB
const MONGO_USER = process.env.MONGO_USERNAME;
const {
  MONGO_DIR, MONGO_PASSWORD, MONGO_DB, MONGO_PORT, MONGO_URI,
} = process.env;
let MONGO_URL;

if (!MONGO_URI) {
  assert.ok(MONGO_DIR, 'No esta definida la varibale MONGO_DIR');
  assert.ok(MONGO_USER, 'No esta definida la varibale MONGO_USER');
  assert.ok(MONGO_PASSWORD, 'No esta definida la varibale MONGO_PASSWORD');
  assert.ok(MONGO_DB, 'No esta definida la varibale MONGO_DB');
  assert.ok(MONGO_PORT, 'No esta definida la varibale MONGO_PORT');
  const URL = `${MONGO_DIR}:${MONGO_PORT}/${MONGO_DB}`;
  MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${URL}`;
} else {
  MONGO_URL = MONGO_URI;
}

// ETHR
const { ISSUER_SERVER_DID, ISSUER_SERVER_PRIVATE_KEY } = process.env;

assert.ok(ISSUER_SERVER_DID, 'No esta definida la varibale ISSUER_SERVER_DID');
assert.ok(ISSUER_SERVER_PRIVATE_KEY, 'No esta definida la varibale ISSUER_SERVER_PRIVATE_KEY');

// Application insigths
const DISABLE_TELEMETRY_CLIENT = process.env.DISABLE_TELEMETRY_CLIENT === 'true';
const { APP_INSIGTHS_IKEY } = process.env;

assert.ok(APP_INSIGTHS_IKEY, 'No esta definida la varibale APP_INSIGTHS_IKEY');

// Provider
// MAINNET SHOULD BE THE FIRST NETWORK
// DID ROUTE EXAMPLE PREFIX:
// MAINNET ==> did:ethr:
// RSK ==> did:ethr:rsk:
// LACCHAIN ==> did:ethr:lacchain:
const PROVIDER_CONFIG = {
  networks: [
    {
      name: 'mainnet',
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'ropsten',
      rpcUrl: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'rinkeby',
      rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'goerli',
      rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'kovan',
      rpcUrl: `https://kovan.infura.io/v3/${INFURA_KEY}`,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
    {
      name: 'lacchain',
      rpcUrl: BLOCKCHAIN_URL_LAC,
      registry: BLOCKCHAIN_CONTRACT_LAC,
    },
    {
      name: 'bfa',
      rpcUrl: BLOCKCHAIN_URL_BFA,
      registry: BLOCKCHAIN_CONTRACT_BFA,
    },
    {
      name: 'rsk',
      rpcUrl: BLOCKCHAIN_URL_RSK,
      registry: BLOCKCHAIN_CONTRACT_MAIN,
    },
  ],
};

const USER_TYPES = {
  Admin: 'Admin',

  // Permisos para Templates
  Read_Templates: 'Read_Templates',
  Write_Templates: 'Write_Templates',
  Delete_Templates: 'Delete_Templates',

  // Permisos para Certificados
  Read_Certs: 'Read_Certs',
  Write_Certs: 'Write_Certs',
  Delete_Certs: 'Delete_Certs',

  // Permisos para Delegaciones
  Read_Delegates: 'Read_Delegates',
  Write_Delegates: 'Write_Delegates',

  // Permisos para Registro de DIDs
  Read_Dids_Registers: 'Read_Dids_Registers',
  Write_Dids_Registers: 'Write_Dids_Registers',

  // Permisos para Perfiles
  Read_Profiles: 'Read_Profiles',
  Write_Profiles: 'Write_Profiles',
  Delete_Profiles: 'Delete_Profiles',

  // Permisos para Usuarios
  Read_Users: 'Read_Users',
  Write_Users: 'Write_Users',
  Delete_Users: 'Delete_Users',
};

const {
  Admin,
  Read_Templates,
  Write_Templates,
  Delete_Templates,
  Read_Certs,
  Write_Certs,
  Delete_Certs,
  Read_Delegates,
  Write_Delegates,
  Read_Dids_Registers,
  Write_Dids_Registers,
  Read_Profiles,
  Write_Profiles,
  Delete_Profiles,
  Read_Users,
  Write_Users,
  Delete_Users,
} = USER_TYPES;

const ALLOWED_ROLES = {
  Admin: [Admin],

  // Permisos para Templates
  Read_Templates: [Read_Templates, Write_Templates, Delete_Templates, Write_Certs, Read_Certs],
  Write_Templates: [Write_Templates],
  Delete_Templates: [Delete_Templates],

  // Permisos para Certificados
  Read_Certs: [Read_Certs, Write_Certs, Delete_Certs],
  Write_Certs: [Write_Certs],
  Delete_Certs: [Delete_Certs],

  // Permisos para Delegaciones
  Read_Delegates: [Read_Delegates, Write_Delegates],
  Write_Delegates: [Write_Delegates],

  // Permisos para Registro de DIDs
  Read_Dids_Registers: [Read_Dids_Registers, Write_Dids_Registers, Read_Certs, Write_Certs],
  Write_Dids_Registers: [Write_Dids_Registers],

  // Permisos para Perfiles
  Read_Profiles: [Read_Profiles, Write_Profiles, Delete_Profiles, Read_Users, Write_Users],
  Write_Profiles: [Write_Profiles],
  Delete_Profiles: [Delete_Profiles],

  // Permisos para Usuarios
  Read_Users: [Read_Users, Write_Users, Delete_Users],
  Write_Users: [Write_Users],
  Delete_Users: [Delete_Users],
};

const USER_CREATED_TYPES = Object.keys(USER_TYPES).filter((r) => r !== Admin);

const BLOCKCHAIN_MANAGER_MESSAGES = {
  signatureInvalid: 'Signature invalid for JWT',
  invalidEthrDid: 'Not a valid ethr DID',
};

const BLOCKCHAIN_MANAGER_CODES = {
  [BLOCKCHAIN_MANAGER_MESSAGES.signatureInvalid]: 'INVALID_PRIVATE_KEY',
  [BLOCKCHAIN_MANAGER_MESSAGES.invalidEthrDid]: 'INVALID_DID',
};

const CERT_FIELD_TYPES = {
  Text: 'Text',
  Paragraph: 'Paragraph',
  Date: 'Date',
  Number: 'Number',
  Boolean: 'Boolean',
  Checkbox: 'Checkbox',
};

const CERT_CATEGORY_TYPES = ['EDUCACION', 'FINANZAS', 'VIVIENDA', 'IDENTIDAD', 'BENEFICIOS', 'LABORAL'];
const CERT_CATEGORY_MAPPING = {
  EDUCACION: 'education',
  FINANZAS: 'finance',
  VIVIENDA: 'livingPlace',
  IDENTIDAD: 'identity',
  BENEFICIOS: 'benefit',
  LABORAL: 'work',
};

const BLOCKCHAINS = ['rsk', 'lacchain', 'bfa'];

const STATUS = {
  CREATING: 'Creando',
  DONE: 'Creado',
  ERROR: 'Error',
  ERROR_RENEW: 'Error al Renovar',
  REVOKED: 'Revocado',
  REVOKING: 'Revocando',
};

const STATUS_ALLOWED = Object.values(STATUS);

const BLOCK_CHAIN_DEFAULT = 'rsk';

module.exports = {
  VERSION,
  API_VERSION: '1.0',
  DEBUGG,

  VALIDATION_TYPES: {
    TOKEN_MATCHES_USER_ID: 'tokenMatchesUserId',
    IS_ARRAY: 'isArray',
    IS_STRING: 'isString',
    IS_BOOLEAN: 'isBoolean',
    IS_PASSWORD: 'isPassword',
    IS_CERT_DATA: 'isCertData',
    IS_PART_DATA: 'isPartData',
    IS_TEMPLATE_DATA: 'isTemplateData',
    IS_TEMPLATE_DATA_TYPE: 'isTemplateDataType',
    IS_TEMPLATE_DATA_VALUE: 'isTemplateDataValue',
    IS_TEMPLATE_PREVIEW_DATA: 'isTemplatePreviewData',
    IS_CERT_MICRO_CRED_DATA: 'isCertMicroCredData',
    IS_NEW_PARTICIPANTS_DATA: 'isNewParticipantsData',
  },

  DATA_TYPES: {
    CERT: 'cert',
    OTHERS: 'others',
    PARTICIPANT: 'participant',
  },

  TYPE_MAPPING: {
    Email: 'Email',
    Telefono: 'Phone',
    Dni: 'dni',
    Nacionalidad: 'nationality',
    Nombres: 'names',
    Apellidos: 'lastNames',
    Direccion: 'streetAddress',
    Calle: 'numberStreet',
    Piso: 'floor',
    Departamento: 'department',
    'Codigo Zip': 'zipCode',
    // Ciudad: "city",
    // Municipalidad: "municipality",
    // Provincia: "province",
    Pais: 'country',
  },

  COMMON_PASSWORDS: ['123456', 'contraseña', 'password'],
  PASSWORD_MIN_LENGTH: 6,
  SALT_WORK_FACTOR: 16,

  PREVIEW_ELEMS_LENGTH: {
    1: 2,
    2: 4,
    3: 6,
    4: 6,
  },

  USER_TYPES,
  USER_CREATED_TYPES,

  CERT_CATEGORY_MAPPING,
  CERT_CATEGORY_TYPES,

  ALLOWED_ROLES,

  CERT_FIELD_TYPES,
  CERT_FIELD_MANDATORY: {
    DID: 'DID',
    NAME: 'CREDENCIAL',
    FIRST_NAME: 'NOMBRE',
    LAST_NAME: 'APELLIDO',
    EXPIRATION_DATE: 'EXPIRATION DATE',
  },

  CREDENTIALS: {
    TYPES: {
      VERIFIABLE: 'VerifiableCredential',
    },
    CONTEXT: 'https://www.w3.org/2018/credentials/v1',
  },

  BLOCKCHAIN: {
    PROVIDER_CONFIG,
    GAS_INCREMENT,
    URL: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    CONTRACT: BLOCKCHAIN_CONTRACT_MAIN,
    DELEGATE_DURATION,
    SET_ATTRIBUTE,
  },

  BLOCKCHAINS,
  STATUS,
  STATUS_ALLOWED,
  RSA_PRIVATE_KEY,
  HASH_SALT,

  DIDI_API,

  ISSUER_SERVER_DID,
  ISSUER_SERVER_PRIVATE_KEY,
  NAME,
  ISSUER_API_URL,
  MONGO_URL,
  PORT,
  ADDRESS,
  FULL_URL,

  ENABLE_INSECURE_ENDPOINTS,

  BLOCK_CHAIN_DEFAULT,

  BLOCKCHAIN_MANAGER_MESSAGES,
  BLOCKCHAIN_MANAGER_CODES,

  DISABLE_TELEMETRY_CLIENT,
  APP_INSIGTHS_IKEY,
};
