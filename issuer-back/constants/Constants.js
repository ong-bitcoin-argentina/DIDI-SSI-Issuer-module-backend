const DEBUGG = process.env.DEBUGG_MODE;
const MONGO_DIR = process.env.MONGO_DIR;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_USER = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

const ISSUER_DELEGATOR_DID = process.env.ISSUER_DELEGATOR_DID;
const ISSUER_SERVER_DID = process.env.ISSUER_SERVER_DID;
const ISSUER_SERVER_NAME = process.env.ISSUER_SERVER_NAME;
const ISSUER_SERVER_PRIVATE_KEY = process.env.ISSUER_SERVER_PRIVATE_KEY;
const ISSUER_API_URL = process.env.ISSUER_API_URL;

const ENABLE_INSECURE_ENDPOINTS = process.env.ENABLE_INSECURE_ENDPOINTS;

const ADDRESS = process.env.ADDRESS;
const PORT = process.env.PORT;
const FULL_URL = process.env.FULL_URL;

const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY;
const HASH_SALT = process.env.HASH_SALT;

const BLOCK_CHAIN_URL = process.env.BLOCK_CHAIN_URL;
const BLOCK_CHAIN_CONTRACT = process.env.BLOCK_CHAIN_CONTRACT;
const DELEGATE_DURATION = process.env.BLOCK_CHAIN_DELEGATE_DURATION || "1300000";
const SET_ATTRIBUTE = process.env.BLOCK_CHAIN_SET_ATTRIBUTE || "999999999";

const URL = MONGO_DIR + ":" + MONGO_PORT + "/" + MONGO_DB;
const MONGO_URL =
	MONGO_USER && MONGO_PASSWORD ? "mongodb://" + MONGO_USER + ":" + MONGO_PASSWORD + "@" + URL : "mongodb://" + URL;
console.log(MONGO_URL);

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
	Write_Dids_Registers: "Write_Dids_Registers"
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
	Write_Dids_Registers
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
	Write_Dids_Registers: [Write_Dids_Registers]
};

const USER_CREATED_TYPES = Object.keys(USER_TYPES).filter(r => r !== Admin);
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
	PENDING: "Pendiente",
	DONE: "Creado",
	ERROR: "Error",
	ERROR_RENEW: "Error al Renovar"
};

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
		BLOCK_CHAIN_URL: BLOCK_CHAIN_URL,
		BLOCK_CHAIN_CONTRACT: BLOCK_CHAIN_CONTRACT,
		DELEGATE_DURATION: DELEGATE_DURATION,
		SET_ATTRIBUTE: SET_ATTRIBUTE
	},

	BLOCKCHAINS: BLOCKCHAINS,
	STATUS: STATUS,
	STATUS_ALLOWED: [STATUS.PENDING, STATUS.ERROR, STATUS.DONE, STATUS.ERROR_RENEW],

	RSA_PRIVATE_KEY: RSA_PRIVATE_KEY,
	HASH_SALT: HASH_SALT,

	DIDI_API: DIDI_API,

	ISSUER_DELEGATOR_DID: ISSUER_DELEGATOR_DID,
	ISSUER_SERVER_DID: ISSUER_SERVER_DID,
	ISSUER_SERVER_PRIVATE_KEY: ISSUER_SERVER_PRIVATE_KEY,
	ISSUER_SERVER_NAME: ISSUER_SERVER_NAME,
	ISSUER_API_URL: ISSUER_API_URL,
	MONGO_URL: MONGO_URL,
	PORT: PORT,
	ADDRESS: ADDRESS,
	FULL_URL: FULL_URL,

	ENABLE_INSECURE_ENDPOINTS: ENABLE_INSECURE_ENDPOINTS
};
