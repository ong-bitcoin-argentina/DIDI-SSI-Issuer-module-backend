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
				REQUEST_SENT: "Pedido enviado",
				LOAD_BY_QR: "Cargar participante con código Qr",
				DIDS_TITLE: "DIDS Cargados:"
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
			LOAD_DIDS_FROM_CSV: "Cargar Dids por CSV",
			ADD_MICRO_CRED_LABEL: "Agregar Micro",
			REMOVE_MICRO_CRED_LABEL: "Quitar Micro",
			ADD_MICRO_CRED: "+",
			REMOVE_MICRO_CRED: "-",
			REMOVE_PARTICIPANTS: "X",
			SAMPLE_PART_FROM_CSV: "Generar CSV",
			SAMPLE_CERT_FROM_CSV: "Generar CSV",
			LOAD_CERT_FROM_CSV: "Cargar con CSV",
			ADD_PARTICIPANTS: "Nuevo Participante",
			LOAD_PARTICIPANTS: "Cargar Participantes",
			CREATE: "NUEVO CAMPO",
			SEND: "Enviar",
			SAVE: "Guardar",
			CANCEL: "Cancelar",
			CLOSE: "Cerrar",
			BACK: "Volver",
			EXIT: "Salir",
			REQUIRED: "Requerido",
			DELETE: "Borrar"
		}
	},
	LIST: {
		DIALOG: {
			DELETE_CONFIRMATION: "Esta seguro?",
			DELETE_CERT_TITLE: "Borrar Certificado",
			DELETE_TEMPLATE_TITLE: "Borrar Modelo",
			DELETE: "Borrar",
			TITLE: "Crear Modelo",
			NAME: "Nombre",
			CREATE: "Crear",
			CANCEL: "Cancelar",
			CLOSE: "Cerrar"
		},
		TABLE: {
			HAS_TEL: "TELEFONO",
			HAS_MAIL: "MAIL",
			HAS_PERSONAL: "DATOS PERSONALES",
			HAS_ADDRESS: "DOMICILIO",
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
		TEMPLATE_PART_SELECT_MESSAGE: "Elige el usuario a el que se pediran los datos:",
		TEMPLATE_SELECT_MESSAGE: "Elige el template para el que se pediran los datos:",
		QR_MESSAGE_CERT: "O alternativamente ecanea el qr con la aplicacion para cargar los datos:",
		QR_MESSAGE: "Ecanear el qr con la aplicacion para cargar los datos requeridos por el template elegido:",
		FULL_NAME: "NOMBRE COMPLETO",
		BUTTONS: {
			REQUEST: "Pedir certificados",
			QR_LOAD: "Cargar por Qr",
			GENERATE: "Generar Qr"
		}
	}
};
