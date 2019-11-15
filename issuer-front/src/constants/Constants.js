const API = "http://localhost:3500/api/1.0/didi_issuer";

module.exports = {
	API_ROUTES: {
		LOGIN: API + "/user/login",
		TEMPLATES: {
			GET_ALL: API + "/template/all",
			GET: id => {
				return API + "/template/" + id;
			},
			CREATE: API + "/template/",
			CREATE_FIELD: id => {
				return API + "/template/" + id + "/data";
			},
			TOGGLE_REQUIRED: id => {
				return API + "/template/" + id + "/required";
			},
			SET_DEFAULT_FIELD: id => {
				return API + "/template/" + id + "/default";
			},
			DELETE: id => {
				return API + "/template/" + id;
			},
			DELETE_FIELD: id => {
				return API + "/template/" + id + "/data";
			}
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
		TEMPLATES: "/templates",
		EDIT_TEMPLATE: "/templates/edit/",
		CERTIFICATES: "/certificates",
		EDIT_CERT: "/certificates/edit/"
	},

	TEMPLATES: {
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
		TYPES: {
			TEXT: "Text",
			PARAGRAPH: "Paragraph",
			DATE: "Date",
			NUMBER: "Number",
			BOOLEAN: "Boolean",
			CHECKBOX: "Checkbox"
		},
		DATA_TYPES: {
			CERT: "certData",
			OTHERS: "othersData",
			PARTICIPANT: "participantData"
		},
		MANDATORY_DATA: {
			NAME: "NOMBRE DEL CURSO"
		}
	},

	CERTIFICATES: {
		MANDATORY_DATA: {
			FIRST_NAME: "NOMBRE",
			LAST_NAME: "APELLIDO"
		},
		EDIT: {
			TEMPLATE_SELECT: "NOMBRE DEL CURSO"
		},
		TABLE: {
			PAGE_SIZE: 10,
			MIN_ROWS: 3
		}
	}
};
