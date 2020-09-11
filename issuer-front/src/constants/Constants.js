const API = process.env.REACT_APP_API_URL;
const VERSION = process.env.REACT_APP_VERSION;

module.exports = {
	VERSION,
	API_ROUTES: {
		LOGIN: API + "/user/login",
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
		NAME: "Certificado o Curso",
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
		CATEGORIES: ["EDUCACION", "FINANZAS", "VIVIENDA", "IDENTIDAD", "BENEFICIOS", "LABORAL"],
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
			NAME: "Certificado o Curso"
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
					message: "La cantidad de campos en el csv no se corresponde con la del certificado."
				};
			},
			EXP_DATE_INVALID: {
				err: "EXP_DATE_INVALID",
				message: "La fecha de expiracion debe ser mayor a la fecha actual."
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
			TEMPLATE_SELECT: "Certificado o Curso"
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

	DATE_FORMAT: "YYYY-MM-DD"
};
