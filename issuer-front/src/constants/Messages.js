module.exports = {
	LOGIN: {
		WELCOME: "Bienvenido al",
		WELCOME_2: "Emisor de Credenciales Web",
		BUTTONS: {
			ENTER: "Ingresar"
		}
	},
	EDIT: {
		DATA: {
			PREVIEW: "Campos a Previsualizar",
			CATEGORIES: "Categoría de la Credencial",
			CERT: "Datos de la Credencial",
			PART: "Datos del Participante",
			OTHER: "Otros Datos",
			EMISOR: "Emisor",

			MICRO_CRED_NAME: "Nombre de la Micro",
			MICRO_CRED_FIELDS: "Campos de la Micro"
		},
		DIALOG: {
			QR: {
				REQUEST_SENT: "Pedido enviado",
				LOAD_BY_QR: "Cargar participante con código Qr",
				LOADED_BY_QR: name => {
					return "Participante " + name + " cargado.";
				},
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
			LOAD_DIDS_FROM_CSV: "Cargar DIDs por CSV",
			ADD_MICRO_CRED_LABEL: "Agregar Micro",
			REMOVE_MICRO_CRED_LABEL: "Quitar Micro",
			ADD_MICRO_CRED: "+",
			REMOVE_MICRO_CRED: "-",
			REMOVE_PARTICIPANTS: "X",
			SAMPLE_PART_FROM_CSV: "Descargar Modelo Carga CSV",
			SAMPLE_CERT_FROM_CSV: "Generar CSV",
			LOAD_CERT_FROM_CSV: "Cargar con CSV",
			ADD_PARTICIPANTS: "Nuevo Participante",
			LOAD_PARTICIPANTS: "Cargar Participantes",
			RENAME_ISSUER: "Renombrar Emisor",
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
		MENU: {
			TITLE: "Menu"
		},
		DIALOG: {
			ISSUER_RENAME_TITLE: name => {
				return "Renombrar emisor (El nombre actual es '" + name + "'):";
			},
			DELETE_CONFIRMATION: title => `¿Está seguro que desea eliminar ${title}?`,
			DELETE_CERT_TITLE: "Borrar Credencial",
			DELETE_TEMPLATE_TITLE: "Borrar Modelo",
			DELETE_DELEGATE_TITLE: "Borrar Delegado",
			REVOKE_CERT_TITLE: "Revocar Credencial",
			REVOKE_CONFIRMATION: "Esta seguro?",
			REVOKE: "Revocar",
			DELETE: "Borrar",
			CREATE_DELEGATE_TITLE: "Crear Delegado",
			CREATE_TEMPLATE_TITLE: "Crear Modelo",
			DID: "Did",
			NAME: "Nombre",
			CREATE: "Crear",
			CANCEL: "Cancelar",
			CLOSE: "Cerrar"
		},
		TABLE: {
			DID: "DID",
			HAS_TEL: "TELEFONO",
			HAS_MAIL: "MAIL",
			HAS_PERSONAL: "DATOS",
			HAS_PERSONAL2: "PERSONALES",
			HAS_ADDRESS: "DOMICILIO",
			TEMPLATE: "Modelo de Credencial",
			CERT: "Credencial",
			LAST_NAME: "APELLIDO",
			NAME: "NOMBRE",
			PREV: "ANTERIOR",
			NEXT: "SIGUIENTE",
			EMISSION_DATE: "FECHA DE",
			EMISSION_DATE2: "EMISION",
			REVOCATION: "REVOCACIÓN",
			SELECT: "SELECCIONAR",
			ACTIONS: "ACCIONES"
		},
		BUTTONS: {
			CREATE_DELEGATE: "Crear Delegado",
			DELEGATES: "Delegados",
			TO_QR: "Registro de DIDs",
			TO_CERTIFICATES_PENDING: "Credenciales Pendientes",
			TO_CERTIFICATES: "Credenciales",
			TO_REVOKED_CERTIFICATES: "Credenciales Revocadas",
			TO_TEMPLATES: "Templates",
			CREATE_TEMPLATE: "Crear Modelo de Credencial",
			CREATE_CERT: "Crear Credencial",
			EMMIT_SELECTED: "Emitir Seleccionados",
			EMMIT: "Emitir",
			VIEW: "Ver",
			EDIT: "Editar",
			DELETE: "Borrar",
			REVOKE: "Revocar",
			EXIT: "Salir",
			USERS: "Usuarios",
			CONFIG: "Configuracion"
		}
	},
	QR: {
		LOAD_SUCCESS: name => {
			return "USUARIO '" + name + "' CARGADO CON ÉXITO";
		},
		DID_SELECT: "DID",
		CERTIFICATE_SELECT: "Credencial A PEDIR",
		TEMPLATE_SELECT: "MODELO DE Credencial",
		TEMPLATE_PART_SELECT_MESSAGE: "Elige el usuario a el que se pediran los datos:",
		TEMPLATE_SELECT_MESSAGE: "Elige el modelo de Credencial para el que se pediran los datos:",
		QR_MESSAGE_CERT: "O alternativamente ecanea el qr con la aplicacion para cargar los datos:",
		QR_MESSAGE: "Ecanear el qr con la aplicacion para cargar los datos requeridos por el modelo de Credencial:",
		QR_PD: "Nota: Los datos obtenidos a partir del Qr seran accessibles solo para el modelo de Credencial actual",
		FULL_NAME: "NOMBRE COMPLETO",
		BUTTONS: {
			REQUEST: "Solicitar Credenciales",
			QR_LOAD: "Cargar DID por QR",
			GENERATE: "Generar Qr"
		}
	}
};
