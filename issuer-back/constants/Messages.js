module.exports = {
	INDEX: {
		ERR: {
			CONNECTION: "Error de conexion en la base de datos: "
		},
		MSG: {
			CONNECTING: "conectandose a: ",
			CONNECTED: "Base de datos conectada.",
			HELLO_WORLD: "Hola DIDI!",
			RUNNING_ON: "Ejecutandose en puerto ",
			STARTING_WORKER: "Arrancando nuevo worker",
			STARTING_WORKERS: num => {
				return "Inicializando " + num + " workers";
			},
			STARTED_WORKER: pid => {
				return "Worker " + pid + " inicializado";
			},
			ENDED_WORKER: (pid, code, signal) => {
				return "Worker " + pid + " termino con codigo: " + code + ", y señal: " + signal;
			}
		}
	},
	REGISTER: {
		ERR: {
			CREATE: { code: "REGISTER_CREATE", message: "El registro no pudo ser creado." },
			BLOCKCHAIN: { code: "NOT_EXIST_BLOCKCHAIN", message: "No existe la blockchain elegida." },
			GET: { code: "REGISTER_GET", message: "El registro no pudo ser obtenido." },
			DID_EXISTS: { code: "DID_EXISTS", message: "Ya existe un registro con ese did." }
		}
	},
	DELEGATE: {
		ERR: {
			SET_NAME: { code: "SET_NAME", message: "No se pudo actualizar el nombre del emisor." },
			GET_NAME: { code: "GET_NAME", message: "No se pudo obtener el nombre del emisor." },
			DELEGATE: { code: "DELEGATE", message: "No se pudo realizar la delegación." },
			CREATE: { code: "DELEGATE_CREATE", message: "El delegado no pudo ser creado." },
			GET: { code: "DELEGATE_GET", message: "El delegado no pudo ser obtenido." },
			DELETE: { code: "DELEGATE_DELETE", message: "El delegado no pudo ser borrado." }
		}
	},
	USER: {
		ERR: {
			INVALID_USER: { code: "INVALID_USER", message: "El usuario y contraseña no coinciden." },
			CREATE: { code: "USER_CREATE", message: "El usuario no pudo ser creado." },
			GET: { code: "USER_GET", message: "El usuario no pudo ser obtenido." },
			SET_NAME: { code: "DELEGATE_SET_NAME", message: "El delegado no pudo ser verificado." },
			GET_NAME: { code: "DELEGATE_GET_NAME", message: "El nombre del emisor no pudo ser obtenido." },
			TYPE: { code: "INVALID_TYPE", message: "El tipo elegido para el usuario no es valido." },
			DELETE: { code: "USER_DELETE", message: "El modelo de usuario no pudo ser borrado." }
		}
	},
	CERT: {
		ERR: {
			EMMIT: { code: "CERT_EMMIT", message: "El certificado no pudo ser emitido." },
			CREATE: { code: "CERT_CREATE", message: "El certificado no pudo ser creado." },
			GET: { code: "CERT_GET", message: "El certificado no pudo ser obtenido." },
			EDIT: { code: "CERT_EDIT", message: "El certificado no pudo ser modificado." },
			DELETE: { code: "CERT_DELETE", message: "El certificado no pudo ser borrado." },
			REVOKE: { code: "CERT_REVOKE", message: "El certificado no pudo ser revocado." }
		}
	},
	PARTICIPANT: {
		ERR: {
			CREATE: { code: "PARTICIPANT_CREATE", message: "El modelo de participante no pudo ser creado." },
			GET: { code: "PARTICIPANT_GET", message: "El modelo de participante no pudo ser obtenido." },
			EDIT: { code: "PARTICIPANT_EDIT", message: "El modelo de participante no pudo ser modificado." },
			DELETE: { code: "PARTICIPANT_DELETE", message: "El modelo de participante no pudo ser borrado." }
		}
	},
	SHARE_REQ: {
		ERR: {
			CREATE: { code: "SHARE_REQ_CREATE", message: "El pedido de certificados no pudo ser creado." },
			SEND: { code: "SHARE_REQ_SEND", message: "El pedido de certificados no pudo ser enviado." }
		}
	},
	TEMPLATE: {
		ERR: {
			CREATE: { code: "TEMPLATE_CREATE", message: "El modelo de certificado no pudo ser creado." },
			GET: { code: "TEMPLATE_GET", message: "El modelo de certificado no pudo ser obtenido." },
			EDIT: { code: "TEMPLATE_EDIT", message: "El modelo de certificado no pudo ser modificado." },
			DELETE: { code: "TEMPLATE_DELETE", message: "El modelo de certificado no pudo ser borrado." }
		}
	},
	CERTIFICATE: {
		CREATED: "Certificado creado",
		VERIFIED: "Certificado verificado",
		SAVED: "Certificado guardado",
		ERR: {
			VERIFY: { code: "CERT_VERIFY_ERROR", message: "Error al validar la credencial." }
		},
		CERT_FIELDS: {
			NAME: "CREDENCIAL",
			PARTICIPANT_NAME: "NOMBRE",
			PARTICIPANT_LAST_NAME: "APELLIDO"
		}
	},
	VALIDATION: {
		INVALID_TOKEN: { code: "INVALID_TOKEN", message: "Token invalido." },
		ROLES: {
			Admin: { code: "NOT_ADMIN", message: "Esta operacion requiere privilegios de administrador." },
			Manager: { code: "NOT_MANAGER", message: "Esta operacion requiere privilegios de gestor." },
			Manager: { code: "NOT_OBSERVER", message: "Esta operacion requiere privilegios de visualizador." }
		},
		TEMPLATE_DATA_TYPE: {
			INVALID_DATA_TYPE: function (data) {
				return { code: "INVALID_DATA_TYPE", message: `${data} no es una sección válida del certificado.` };
			}
		},
		TEMPLATE_DATA_VALUE: {
			INVALID_DATA_VALUE: function (type) {
				return {
					code: "INVALID_DATA_VALUE",
					message: "el campo " + type + " contiene un valor invalido."
				};
			}
		},
		TEMPLATE_DATA: {
			INVALID_TEMPLATE_PREVIEW_TYPE: {
				code: "INVALID_TEMPLATE_PREVIEW_TYPE",
				message: "Se permiten actalmetne solo 2, 4 o 6 campos para previsualizar."
			},
			INVALID_TEMPLATE_ID: { code: "INVALID_TEMPLATE_ID", message: "No existe modelo de certificado con ese id." },
			INVALID_TEMPLATE_PREVIEW_DATA: {
				code: "INVALID_TEMPLATE_PREVIEW_DATA",
				message: "El modelo de certificado no contiene los tipos requeridos."
			},
			NO_DATA: function (type) {
				return { code: "NO_DATA", message: `El campo ${type} no contiene datos.` };
			},
			INVALID_DATA: function (type) {
				return { code: "INVALID_DATA", message: `El campo ${type} tiene un formato invalido.` };
			},
			INVALID_TYPE: function (type) {
				return { code: "INVALID_TYPE", message: `El campo ${type} tiene un tipo de dato invalido.` };
			},
			MISSING_CHECKBOX_OPTIONS: function (type) {
				return {
					code: "MISSING_CHECKBOX_OPTIONS",
					message: `El campo ${type} es de tipo 'checkbox' pero falta el campo 'options'.`
				};
			}
		},
		CERT_DATA: {
			INVALID_MICROCRED_DATA: function (name) {
				return {
					code: "INVALID_MICROCRED_DATA",
					message: "El campo " + name + " no puede ser parte de una microcredencial, no se encuentra en el certificado."
				};
			},
			INVALID_TEMPLATE_ID: function (type) {
				return { code: "INVALID_TEMPLATE_ID", message: `El campo ${type} es inválido.` };
			},
			EXTRA_ELEMENT: function (name) {
				return { code: "EXTRA_ELEMENT", message: `El campo ${name} no se encuentra en el modelo de certificado.` };
			},
			MISSING_ELEMENT: function (name) {
				return { code: "MISSING_ELEMENT", message: `El campo ${name} está faltando en el certificado.` };
			}
		},
		REQUESTER_IS: user => {
			return "El token le pertenece a: " + user.name;
		},
		COMMON_PASSWORD: {
			code: "COMMON_PASSWORD",
			message: "La contraseña ingresada es de uso común, por favor ingrese una mas segura."
		},
		DOES_NOT_EXIST: function (type) {
			return { code: "PARAMETER_MISSING", message: "Falta el campo: " + type };
		},
		STRING_FORMAT_INVALID: function (field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "El campo " + field + " es incorrecto, se esperaba un texto."
			};
		},
		LENGTH_INVALID: function (field, min, max) {
			const code = "PARAMETER_TYPE_ERROR";
			const msgStart = `El campo ${field} tendria que tener.`;

			if (min && !max) {
				return {
					code: code,
					message: `${msgStart} mas que ${min} caracteres.`
				};
			}

			if (!min && max) {
				return {
					code: code,
					message: `${msgStart} menos que ${max} caracteres.`
				};
			}

			if (min == max) {
				return {
					code: code,
					message: `${msgStart} exactamente ${max} caracteres.`
				};
			} else {
				return {
					code: code,
					message: `${msgStart} entre ${min} y ${max} caracteres.`
				};
			}
		}
	}
};
