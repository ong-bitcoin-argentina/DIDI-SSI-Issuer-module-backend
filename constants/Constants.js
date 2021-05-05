if (process.env.DEBUGG == null || process.env.DEBUGG == '') throw new Error('No esta definida la varibale DEBUGG');
if (process.env.MONGO_DIR == null || process.env.MONGO_DIR == '') throw new Error('No esta definida la varibale MONGO_DIR');
if (process.env.MONGO_PORT == null || process.env.MONGO_PORT == '') throw new Error('No esta definida la varibale MONGO_PORT');
if (process.env.MONGO_DB == null || process.env.MONGO_DB == '') throw new Error('No esta definida la varibale MONGO_DB');

if (process.env.ISSUER_SERVER_DID == null || process.env.ISSUER_SERVER_DID == '') throw new Error('No esta definida la varibale ISSUER_SERVER_DID');
if (process.env.ISSUER_SERVER_PRIVATE_KEY == null || process.env.ISSUER_SERVER_PRIVATE_KEY == '') throw new Error('No esta definida la varibale ISSUER_SERVER_PRIVATE_KEY');
if (process.env.ISSUER_API_URL == null || process.env.ISSUER_API_URL == '') throw new Error('No esta definida la varibale ISSUER_API_URL');

if (process.env.ENABLE_INSECURE_ENDPOINTS == null || process.env.ENABLE_INSECURE_ENDPOINTS == '') throw new Error('No esta definida la varibale ENABLE_INSECURE_ENDPOINTS');

if (process.env.ADDRESS == null || process.env.ADDRESS == '') throw new Error('No esta definida la varibale ADDRESS');
if (process.env.PORT == null || process.env.PORT == '') throw new Error('No esta definida la varibale PORT');
if (process.env.FULL_URL == null || process.env.FULL_URL == '') throw new Error('No esta definida la varibale FULL_URL');

if (process.env.RSA_PRIVATE_KEY == null || process.env.RSA_PRIVATE_KEY == '') throw new Error('No esta definida la varibale RSA_PRIVATE_KEY');
if (process.env.HASH_SALT == null || process.env.HASH_SALT == '') throw new Error('No esta definida la varibale HASH_SALT');

if (process.env.URL == null || process.env.URL == '') throw new Error('No esta definida la varibale URL');

if (process.env.BLOCKCHAIN_URL_MAIN == null || process.env.BLOCKCHAIN_URL_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_MAIN');
if (process.env.BLOCKCHAIN_URL_RSK == null || process.env.BLOCKCHAIN_URL_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_RSK');
if (process.env.BLOCKCHAIN_URL_LAC == null || process.env.BLOCKCHAIN_URL_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_LAC');
if (process.env.BLOCKCHAIN_URL_BFA == null || process.env.BLOCKCHAIN_URL_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_URL_BFA');

if (process.env.BLOCKCHAIN_CONTRACT_MAIN == null || process.env.BLOCKCHAIN_CONTRACT_MAIN == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_MAIN');
if (process.env.BLOCKCHAIN_CONTRACT_RSK == null || process.env.BLOCKCHAIN_CONTRACT_RSK == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_RSK');
if (process.env.BLOCKCHAIN_CONTRACT_LAC == null || process.env.BLOCKCHAIN_CONTRACT_LAC == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_LAC');
if (process.env.BLOCKCHAIN_CONTRACT_BFA == null || process.env.BLOCKCHAIN_CONTRACT_BFA == '') throw new Error('No esta definida la varibale BLOCKCHAIN_CONTRACT_BFA');

const DEBUGG = process.env.DEBUGG_MODE;
const MONGO_DIR = process.env.MONGO_DIR;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_USER = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const ISSUER_DELEGATOR_DID = process.env.ISSUER_DELEGATOR_DID;
const ISSUER_SERVER_DID = process.env.ISSUER_SERVER_DID;
const NAME = process.env.NAME;
const ISSUER_SERVER_PRIVATE_KEY = process.env.ISSUER_SERVER_PRIVATE_KEY;
const ISSUER_API_URL = process.env.ISSUER_API_URL;

const ENABLE_INSECURE_ENDPOINTS = process.env.ENABLE_INSECURE_ENDPOINTS;

const ADDRESS = process.env.ADDRESS;
const PORT = process.env.PORT;
const FULL_URL = process.env.FULL_URL;

const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY;
const HASH_SALT = process.env.HASH_SALT;

const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || "1300000";
const SET_ATTRIBUTE = process.env.BLOCK_CHAIN_SET_ATTRIBUTE || "999999999";

const URL = MONGO_DIR + ":" + MONGO_PORT + "/" + MONGO_DB;
const MONGO_URL =
	MONGO_USER && MONGO_PASSWORD ? "mongodb://" + MONGO_USER + ":" + MONGO_PASSWORD + "@" + URL : "mongodb://" + URL;

const BLOCKCHAIN_URL_MAIN = process.env.BLOCKCHAIN_URL_MAIN; // RSK
const BLOCKCHAIN_URL_RSK = process.env.BLOCKCHAIN_URL_RSK; // RSK
const BLOCKCHAIN_URL_LAC = process.env.BLOCKCHAIN_URL_LAC; // Lacchain
const BLOCKCHAIN_URL_BFA = process.env.BLOCKCHAIN_URL_BFA; // BFA testnet

// uPort SC ON
const BLOCKCHAIN_CONTRACT_MAIN = process.env.BLOCKCHAIN_CONTRACT_MAIN; // RSK
const BLOCKCHAIN_CONTRACT_RSK = process.env.BLOCKCHAIN_CONTRACT_RSK; // RSK
const BLOCKCHAIN_CONTRACT_LAC = process.env.BLOCKCHAIN_CONTRACT_LAC; // Lacchain
const BLOCKCHAIN_CONTRACT_BFA = process.env.BLOCKCHAIN_CONTRACT_BFA; // BFA

const GAS_INCREMENT = process.env.GAS_INCREMENT || "1.1";

const PROVIDER_CONFIG = {
	networks: [
		{
			name: "mainnet",
			rpcUrl: BLOCKCHAIN_URL_MAIN,
			registry: BLOCKCHAIN_CONTRACT_MAIN
		},
		{
			name: "lacchain",
			rpcUrl: BLOCKCHAIN_URL_LAC,
			registry: BLOCKCHAIN_CONTRACT_LAC
		},
		{
			name: "bfa",
			rpcUrl: BLOCKCHAIN_URL_BFA,
			registry: BLOCKCHAIN_CONTRACT_BFA
		},
		{
			name: "rsk",
			rpcUrl: BLOCKCHAIN_URL_RSK,
			registry: BLOCKCHAIN_CONTRACT_RSK
		}
	]
};

const USER_TYPES = {
	Admin: "Admin",

	// Permisos para Templates
	Read_Templates: "Read_Templates",
	Write_Templates: "Write_Templates",
	Delete_Templates: "Delete_Templates",

	// Permisos para Certificados
	Read_Certs: "Read_Certs",
	Write_Certs: "Write_Certs",
	Delete_Certs: "Delete_Certs",

	// Permisos para Delegaciones
	Read_Delegates: "Read_Delegates",
	Write_Delegates: "Write_Delegates",

	// Permisos para Registro de DIDs
	Read_Dids_Registers: "Read_Dids_Registers",
	Write_Dids_Registers: "Write_Dids_Registers",

	// Permisos para Perfiles
	Read_Profiles: "Read_Profiles",
	Write_Profiles: "Write_Profiles",
	Delete_Profiles: "Delete_Profiles",

	// Permisos para Usuarios
	Read_Users: "Read_Users",
	Write_Users: "Write_Users",
	Delete_Users: "Delete_Users"
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
	Delete_Users
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
	Delete_Users: [Delete_Users]
};

const USER_CREATED_TYPES = Object.keys(USER_TYPES).filter(r => r !== Admin);

const BLOCKCHAIN_MANAGER_MESSAGES = {
	signatureInvalid: "Signature invalid for JWT",
	invalidEthrDid: "Not a valid ethr DID"
};

const BLOCKCHAIN_MANAGER_CODES = {
	[BLOCKCHAIN_MANAGER_MESSAGES.signatureInvalid]: "INVALID_PRIVATE_KEY",
	[BLOCKCHAIN_MANAGER_MESSAGES.invalidEthrDid]: "INVALID_DID"
};

const CERT_FIELD_TYPES = {
	Text: "Text",
	Paragraph: "Paragraph",
	Date: "Date",
	Number: "Number",
	Boolean: "Boolean",
	Checkbox: "Checkbox"
};

const CERT_CATEGORY_TYPES = ["EDUCACION", "FINANZAS", "VIVIENDA", "IDENTIDAD", "BENEFICIOS", "LABORAL"];
const CERT_CATEGORY_MAPPING = {
	EDUCACION: "education",
	FINANZAS: "finance",
	VIVIENDA: "livingPlace",
	IDENTIDAD: "identity",
	BENEFICIOS: "benefit",
	LABORAL: "work"
};

const DIDI_API = process.env.DIDI_API;

const BLOCKCHAINS = ["rsk", "lacchain", "bfa"];

const STATUS = {
	CREATING: "Creando",
	DONE: "Creado",
	ERROR: "Error",
	ERROR_RENEW: "Error al Renovar",
	REVOKED: "Revocado",
	REVOKING: "Revocando"
};

const STATUS_ALLOWED = Object.values(STATUS);

BLOCK_CHAIN_DEFAULT = "rsk";

module.exports = {
	API_VERSION: "1.0",
	DEBUGG: DEBUGG,

	VALIDATION_TYPES: {
		TOKEN_MATCHES_USER_ID: "tokenMatchesUserId",
		IS_ARRAY: "isArray",
		IS_STRING: "isString",
		IS_BOOLEAN: "isBoolean",
		IS_PASSWORD: "isPassword",
		IS_CERT_DATA: "isCertData",
		IS_PART_DATA: "isPartData",
		IS_TEMPLATE_DATA: "isTemplateData",
		IS_TEMPLATE_DATA_TYPE: "isTemplateDataType",
		IS_TEMPLATE_DATA_VALUE: "isTemplateDataValue",
		IS_TEMPLATE_PREVIEW_DATA: "isTemplatePreviewData",
		IS_CERT_MICRO_CRED_DATA: "isCertMicroCredData",
		IS_NEW_PARTICIPANTS_DATA: "isNewParticipantsData"
	},

	DATA_TYPES: {
		CERT: "cert",
		OTHERS: "others",
		PARTICIPANT: "participant"
	},

	TYPE_MAPPING: {
		Email: "Email",
		Telefono: "Phone",
		Dni: "dni",
		Nacionalidad: "nationality",
		Nombres: "names",
		Apellidos: "lastNames",
		Direccion: "streetAddress",
		Calle: "numberStreet",
		Piso: "floor",
		Departamento: "department",
		"Codigo Zip": "zipCode",
		// Ciudad: "city",
		// Municipalidad: "municipality",
		// Provincia: "province",
		Pais: "country"
	},

	COMMON_PASSWORDS: ["123456", "contraseña", "password"],
	PASSWORD_MIN_LENGTH: 6,
	SALT_WORK_FACTOR: 16,

	PREVIEW_ELEMS_LENGTH: {
		1: 2,
		2: 4,
		3: 6,
		4: 6
	},

	USER_TYPES: USER_TYPES,
	USER_CREATED_TYPES: USER_CREATED_TYPES,

	CERT_CATEGORY_MAPPING: CERT_CATEGORY_MAPPING,
	CERT_CATEGORY_TYPES: CERT_CATEGORY_TYPES,

	ALLOWED_ROLES: ALLOWED_ROLES,

	CERT_FIELD_TYPES: CERT_FIELD_TYPES,
	CERT_FIELD_MANDATORY: {
		DID: "DID",
		NAME: "CREDENCIAL",
		FIRST_NAME: "NOMBRE",
		LAST_NAME: "APELLIDO",
		EXPIRATION_DATE: "EXPIRATION DATE"
	},

	CREDENTIALS: {
		TYPES: {
			VERIFIABLE: "VerifiableCredential"
		},
		CONTEXT: "https://www.w3.org/2018/credentials/v1"
	},

	BLOCKCHAIN: {
		PROVIDER_CONFIG: PROVIDER_CONFIG,
		GAS_INCREMENT: GAS_INCREMENT,
		URL: BLOCKCHAIN_URL_MAIN,
		CONTRACT: BLOCKCHAIN_CONTRACT_MAIN,
		DELEGATE_DURATION: DELEGATE_DURATION,
		SET_ATTRIBUTE: SET_ATTRIBUTE
	},

	BLOCKCHAINS: BLOCKCHAINS,
	STATUS: STATUS,
	STATUS_ALLOWED: STATUS_ALLOWED,

	RSA_PRIVATE_KEY: RSA_PRIVATE_KEY,
	HASH_SALT: HASH_SALT,

	DIDI_API: DIDI_API,

	ISSUER_DELEGATOR_DID: ISSUER_DELEGATOR_DID,
	ISSUER_SERVER_DID: ISSUER_SERVER_DID,
	ISSUER_SERVER_PRIVATE_KEY: ISSUER_SERVER_PRIVATE_KEY,
	NAME: NAME,
	ISSUER_API_URL: ISSUER_API_URL,
	MONGO_URL: MONGO_URL,
	PORT: PORT,
	ADDRESS: ADDRESS,
	FULL_URL: FULL_URL,

	ENABLE_INSECURE_ENDPOINTS: ENABLE_INSECURE_ENDPOINTS,

	BLOCK_CHAIN_DEFAULT: BLOCK_CHAIN_DEFAULT,

	BLOCKCHAIN_MANAGER_MESSAGES: BLOCKCHAIN_MANAGER_MESSAGES,
	BLOCKCHAIN_MANAGER_CODES: BLOCKCHAIN_MANAGER_CODES
};
