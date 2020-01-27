const API = process.env.REACT_APP_API_URL;

module.exports = {
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
			GET: id => {
				return API + "/cert/" + id;
			},
			DELETE: id => {
				return API + "/cert/" + id;
			}
		}
	},
	ROUTES: {
		LOGIN: "/login",
		QR_REQUEST: "/qr_request",
		LIST: "/list",
		TEMPLATES: "/templates",
		EDIT_TEMPLATE: "/templates/edit/",
		CERTIFICATES: "/certificates",
		EDIT_CERT: "/certificates/edit/"
	},

	TEMPLATES: {
		PREVIEW_ELEMS_LENGTH: {
			1: 2,
			2: 4,
			3: 6
		},

		ICONS: {
			ADD_BUTTON: "add_box"
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
		CATEGORIES: ["EDUCACION", "FINANZAS", "VIVIENDA", "IDENTIDAD"],
		TYPES: {
			TEXT: "Text",
			PARAGRAPH: "Paragraph",
			DATE: "Date",
			NUMBER: "Number",
			BOOLEAN: "Boolean",
			CHECKBOX: "Checkbox"
		},
		SHARED_TYPES: {
			Email: "Email",
			Phone: "Telefono",
			dni: "Dni",
			nationality: "Nacionalidad",
			names: "Nombres",
			lastNames: "Apellidos",
			streetAddress: "Direccion",
			numberStreet: "Calle",
			floor: "Piso",
			department: "Departamento",
			zipCode: "Codigo Zip",
			city: "Ciudad",
			municipality: "Municipalidad",
			province: "Provincia",
			country: "Pais"
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
			NAME: "CERTIFICADO O CURSO"
		}
	},

	CERTIFICATES: {
		ERR: {
			INVALID_DID: "Invalid DID",
			CSV_REQUIRED_VALUE_INVALID: function(field) {
				return {
					err: "CSV_REQUIRED_VALUE_INVALID",
					message: "CSV invàlido, el campo " + field + " contiene un valor incorrecto"
				};
			},
			CSV_REQUIRED_VALUE_MISSING: function(field) {
				return { err: "CSV_REQUIRED_VALUE_MISSING", message: "CSV invàlido, el campo " + field + " es obligatorio" };
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
			TEMPLATE_SELECT: "CERTIFICADO O CURSO"
		},
		TABLE: {
			PAGE_SIZE: 10,
			MIN_ROWS: 3
		},
		REQUEST_TYPES: ["Email", "Phone", "Datos Personales", "Domicilio Legal"]
	}
};
