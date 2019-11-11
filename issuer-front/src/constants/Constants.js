const API = "http://localhost:3500/api/1.0/didi_issuer";

module.exports = {
	API_ROUTES: {
		LOGIN: API + "/user/login",
		GET_TEMPLATES: API + "/template/all",
		GET_TEMPLATE: id => {
			return API + "/template/" + id;
		},
		CREATE_TEMPLATE: API + "/template/",
		CREATE_TEMPLATE_FIELD: id => {
			return API + "/template/" + id + "/data";
		},
		DELETE_TEMPLATE: id => {
			return API + "/template/" + id;
		},
		DELETE_TEMPLATE_FIELD: id => {
			return API + "/template/" + id + "/data";
		}
	},
	ROUTES: {
		LOGIN: "/login",
		TEMPLATES: "/templates",
		EDIT_TEMPLATE: "/templates/edit/"
	},

	TEMPLATES: {
		ICONS: {
			ADD_BUTTON: "add_box"
		},
		TABLE: {
			PAGE_SIZE: 10,
			MIN_ROWS: 0
		},
		EDIT: {
			ICONS: {
				REQUIRED: "check_circle_outline",
				NOT_REQUIRED: "radio_button_unchecked",
				ADD_OPTION: "add_circle_outline",
				REMOVE_OPTION: "clear",
				DELETE: "cancel_presentation"
			}
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
		}
	}
};
