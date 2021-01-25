const API = process.env.REACT_APP_API_URL;
const VERSION = process.env.REACT_APP_VERSION;

module.exports = {
	VERSION,
	API_ROUTES: {
		LOGIN: API + "/user/login",
		USER: {
			GET_ALL: API + "/user/all",
			DELETE: id => API + "/user/" + id,
			CREATE: API + "/user",
			EDIT: id => API + "/user/" + id
		},
		PROFILE: API + "/profile",
		REGISTER: {
			CREATE: API + "/register",
			GET: API + "/register",
			GET_ALL_BLOCKCHAINS: API + "/register/all/blockchain"
		},
		DEFAULT_VALUE: API + "/default",
		TEMPLATES: {
			GET_ALL: API + "/template/all",
			GET_QR: (id, code) => {
				return API + "/template/" + id + "/qr/" + code;
			},
			REQUEST: code => {
				return API + "/template/request/" + code;
			},
			GET: id => {
				return API + "/template/" + id;
			},
			CREATE: API + "/template/",
			EDIT: id => {
				return API + "/template/" + id;
			},
			DELETE: id => {
				return API + "/template/" + id;
			}
		},
		PARTICIPANTS: {
			POST_NEW: API + "/participant/new/",
			GET_GLOBAL: API + "/participant/global/",
			GET_ALL: id => {
				return API + "/participant/all/" + id;
			},
			GET_NEW: id => {
				return API + "/participant/new/" + id;
			},
			GET: did => {
				return API + "/participant/" + did;
			},
			GET_DIDS: API + "/participant/dids"
		},
		CERTIFICATES: {
			CREATE: API + "/cert",
			EDIT: id => {
				return API + "/cert/" + id;
			},
			EMMIT: id => {
				return API + "/cert/" + id + "/emmit";
			},
			GET_ALL: API + "/cert/all",
			GET_EMMITED: API + "/cert/find?emmited=true",
			GET_PENDING: API + "/cert/find?emmited=false",
			GET_REVOKED: API + "/cert/find?revoked=true",
			GET: id => {
				return API + "/cert/" + id;
			},
			DELETE: id => {
				return API + "/cert/" + id;
			}
		},
		DELEGATE: {
			CREATE: API + "/delegate",
			DELETE: API + "/delegate",
			GET_ALL: API + "/delegate/all",
			GET_NAME: API + "/delegate/name",
			CHANGE_NAME: API + "/delegate/name"
		}
	},
	ROUTES: {
		LOGIN: "/login",
		DELEGATES: "/admin",
		QR_REQUEST: "/qr_request",
		LIST: "/list",
		TEMPLATES: "/templates",
		EDIT_TEMPLATE: "/templates/edit/",
		CERTIFICATES_PENDING: "/certificates-pending",
		CERTIFICATES: "/certificates",
		CERTIFICATES_REVOKED: "/certificates-revoked",
		EDIT_CERT: "/certificates/edit/"
	},

	CERT_FIELD_MANDATORY: {
		DID: "DID",
		NAME: "Credencial o Curso",
		FIRST_NAME: "NOMBRE",
		LAST_NAME: "APELLIDO",
		EXPIRATION_DATE: "EXPIRATION DATE"
	},

	DELEGATES: {
		ICONS: {
			ADD_BUTTON: "add"
		},
		TABLE: {
			PAGE_SIZE: 10,
			MIN_ROWS: 3
		}
	},

	TEMPLATES: {
		PREVIEW_ELEMS_LENGTH: {
			1: 2,
			2: 4,
			3: 6,
			4: 6
		},

		ICONS: {
			ADD_BUTTON: "add",
			OK: "check_circle_outline",
			MISSING: "highlight_off"
		},
		TABLE: {
			PAGE_SIZE: 10,
			MIN_ROWS: 3
		},
		EDIT: {
			BOOLEAN: {
				TRUE: "Si",
				FALSE: "No"
			},
			ICONS: {
				REQUIRED: "check_circle_outline",
				NOT_REQUIRED: "radio_button_unchecked",
				ADD_OPTION: "add_circle_outline",
				REMOVE_OPTION: "clear",
				DELETE: "cancel_presentation"
			},
			TYPING_TIMEOUT: 1000
		},
		CATEGORIES: ["EDUCACIÓN", "FINANZAS", "VIVIENDA", "IDENTIDAD", "BENEFICIOS", "LABORAL"],
		TYPES: {
			TEXT: "Text",
			PARAGRAPH: "Paragraph",
			DATE: "Date",
			NUMBER: "Number",
			BOOLEAN: "Boolean",
			CHECKBOX: "Checkbox"
		},
		TYPE_MAPPING: {
			Email: "Email",
			Telefono: "Phone",
			Dni: "dni",
			Nacionalidad: "nationality",
			Nombres: "names",
			NOMBRE: "names",
			Apellidos: "lastNames",
			APELLIDO: "lastNames",
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
		SHARED_TYPES: {
			Email: "Email",
			Telefono: "Telefono",
			Dni: "Dni",
			Nacionalidad: "Nacionalidad",
			Nombres: "Nombres",
			Apellidos: "Apellidos",
			Direccion: "Direccion",
			Calle: "Calle",
			Piso: "Piso",
			Departamento: "Departamento",
			"Codigo Zip": "Codigo Zip",
			// city: "Ciudad",
			// municipality: "Municipalidad",
			// province: "Provincia",
			Pais: "Pais"
		},
		DATA_TYPES: {
			CERT: "cert",
			OTHERS: "others",
			PARTICIPANT: "participant"
		},
		MANDATORY_DATA: {
			DID: "DID",
			FULL_NAME: "NOMBRE COMPLETO",
			PARTICIPANT_FIRST_NAME: "NOMBRE",
			PARTICIPANT_LAST_NAME: "APELLIDO",
			NAME: "CREDENCIAL"
		}
	},

	CERTIFICATES: {
		ERR: {
			INVALID_DID: "El DID ingresado es incorrecto o mal formado.",
			CSV_REQUIRED_VALUE_INVALID: function (field) {
				return {
					err: "CSV_REQUIRED_VALUE_INVALID",
					message: "CSV inválido, el campo " + field + " contiene un valor incorrecto"
				};
			},
			CSV_REQUIRED_VALUE_MISSING: function (field) {
				return { err: "CSV_REQUIRED_VALUE_MISSING", message: "CSV inválido, el campo " + field + " es obligatorio" };
			},
			MISSING_FIELD: function (field) {
				return { err: "REQUIRED_VALUE_MISSING", message: "El campo " + field + " es obligatorio" };
			},
			CSV_MISSING_FIELDS: function () {
				return {
					err: "CSV_MISSING_FIELDS",
					message: "La cantidad de campos en el csv no se corresponde con la de la Credencial."
				};
			},
			EXP_DATE_INVALID: {
				err: "EXP_DATE_INVALID",
				message: "La fecha de expiración debe ser mayor a la fecha actual."
			}
		},
		MANDATORY_DATA: {
			DID: "DID",
			FIRST_NAME: "NOMBRE",
			LAST_NAME: "APELLIDO"
		},
		EDIT: {
			PARTICIPANT_SELECT: "SELECCIONAR PARTICIPANTE",
			SPLIT: "GENERAR MICROCREDENCIALES",
			TEMPLATE_SELECT: "CREDENCIAL"
		},
		TABLE: {
			PAGE_SIZE: 10,
			MIN_ROWS: 3
		},
		REQUEST_TYPES: {
			mail: "Email",
			tel: "Phone",
			personal: "Datos Personales",
			address: "Domicilio Legal"
		}
	},

	DATE_FORMAT: "YYYY-MM-DD",
	ROLES: {
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
	},

	ROLES_TRANSLATE: {
		Admin: "Admin",

		// Permisos para Templates
		Read_Templates: "Visualizar Templates",
		Write_Templates: "Crear/Editar Templates",
		Delete_Templates: "Deshabilitar Templates",

		// Permisos para Certificados
		Read_Certs: "Visualizar Credenciales",
		Write_Certs: "Escribir/Emitir Credenciales",
		Delete_Certs: "Revocar Credenciales",

		// Permisos para Delegaciones
		Read_Delegates: "Visualizar Delegaciones",
		Write_Delegates: "Crear/Editar Delegaciones",

		// Permisos para Registro de DIDs
		Read_Dids_Registers: "Visualizar Registros de Dids",
		Write_Dids_Registers: "Crear/Editar Registros de Dids",

		// Permisos para Perfiles
		Read_Profiles: "Visualizar Perfiles",
		Write_Profiles: "Crear/Editar Perfiles",
		Delete_Profiles: "Eliminar Perfiles",

		// Permisos para Usuarios
		Read_Users: "Visualizar Usuarios",
		Write_Users: "Crear/Editar Usuarios",
		Delete_Users: "Eliminar Usuarios"
	},

	BLOCKCHAINS: ["BFA", "RSK", "LACCHAIN"],

	STATUS: {
		DONE: "Creado",
		ERROR: "Error",
		CREATING: "Creando",
		EXPIRED: "Expirado",
		ERROR_RENEW: "Error al Renovar",
		REVOKED: "Revocado",
		REVOKING: "Revocando"
	}
};
