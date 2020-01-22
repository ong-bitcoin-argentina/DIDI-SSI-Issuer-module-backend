module.exports = {
	LOGIN: {
		WELCOME: "BIENVENIDO AL EMISOR DE CERTIFICADOS WEB",
		BUTTONS: {
			ENTER: "Ingresar"
		}
	},
	EDIT: {
		DATA: {
			PREVIEW: "CAMPOS A PREVISUALIZAR",
			CATEGORIES: "CATEGORIA DEL CERTIFICADO",
			CERT: "DATOS DEL CERTIFICADO",
			PART: "DATOS DEL PARTICIPANTE",
			OTHER: "OTROS DATOS",

			MICRO_CRED_NAME: "NOMBRE DE LA MICRO",
			MICRO_CRED_FIELDS: "CAMPOS DE LA MICRO"
		},
		DIALOG: {
			QR: {
				TITLE: "Cargar Participante"
			},
			PARTICIPANT: {
				TITLE: "Agregar Participante",
				NAME: "Participante",
				CREATE: "Agregar",
				CLOSE: "Cerrar"
			},
			FIELD: {
				TITLE: "Agregar Campo",
				OPTION: "Opcion",
				REQUIRED: "Requerido",
				TYPES: "Tipo",
				NAME: "Nombre",
				CREATE: "Crear",
				CLOSE: "Cerrar"
			}
		},
		BUTTONS: {
			ADD_MICRO_CRED_LABEL: "Agregar Micro",
			REMOVE_MICRO_CRED_LABEL: "Quitar Micro",
			ADD_MICRO_CRED: "+",
			REMOVE_MICRO_CRED: "-",
			REMOVE_PARTICIPANTS: "X",
			SAMPLE_CERT_FROM_CSV: "Generar CSV",
			LOAD_CERT_FROM_CSV: "Cargar con CSV",
			ADD_PARTICIPANTS: "Nuevo Participante",
			LOAD_PARTICIPANTS: "Cargar Participantes",
			CREATE: "NUEVO CAMPO",
			SEND: "Enviar",
			SAVE: "Guardar",
			CANCEL: "Cancelar",
			BACK: "Volver",
			EXIT: "Salir",
			REQUIRED: "Requerido",
			DELETE: "Borrar"
		}
	},
	LIST: {
		DIALOG: {
			TITLE: "Crear Modelo",
			NAME: "Nombre",
			CREATE: "Crear",
			CLOSE: "Cerrar"
		},
		TABLE: {
			TEMPLATE: "TEMPLATE DE CERTIFICADO",
			CERT: "CERTIFICADO",
			LAST_NAME: "APELLIDO",
			NAME: "NOMBRE",
			PREV: "ANTERIOR",
			NEXT: "SIGUIENTE",
			EMISSION_DATE: "FECHA DE EMISSION",
			SELECT: "SELECCIONAR",
			ACTIONS: "ACCIONES"
		},
		BUTTONS: {
			TO_QR: "REGISTRAR PARTICIPANTE",
			TO_CERTIFICATES: "CERTIFICADOS",
			TO_TEMPLATES: "TEMPLATES",
			CREATE_TEMPLATE: "CREAR CERTIFICADO",
			CREATE_CERT: "EMITIR CERTIFICADO",
			EMMIT_SELECTED: "Emitir Seleccionados",
			EMMIT: "Emitir",
			VIEW: "Ver",
			EDIT: "Editar",
			DELETE: "Borrar",
			EXIT: "Salir"
		}
	},
	QR: {
		LOAD_SUCCESS: name => {
			return "USUARIO '" + name + "' CARGADO CON ÉXITO";
		},
		DID_SELECT: "DID",
		CERTIFICATE_SELECT: "CERTIFICADO A PEDIR",
		TEMPLATE_SELECT: "TEMPLATE DE CERTIFICADO",
		FULL_NAME: "NOMBRE COMPLETO",
		BUTTONS: {
			REQUEST: "Cargar por pedido",
			QR_LOAD: "Cargar por Qr",
			GENERATE: "Generar Qr"
		}
	}
};
