module.exports = {
	INDEX: {
		ERR: {
			CONNECTION: "Error de conexion en la base de datos: "
		},
		MSG: {
			CONNECTING: "conectandose a: ",
			CONNECTED: "Base de datos conectada.",
			HELLO_WORLD: "Hola DIDI!",
			RUNNING_ON: "Ejecutandose en puerto "
		}
	},
	USER: {
		ERR: {
			INVALID_USER: { code: "INVALID_USER", message: "El usuario y contraseña no coinciden" },
			CREATE: { code: "USER_CREATE", message: "El usuario no pudo ser creado" },
			GET: { code: "USER_GET", message: "El usuario no pudo ser obtenido" }
		}
	},
	TEMPLATE: {
		ERR: {
			CREATE: { code: "UTEMPLATE_CREATE", message: "El modelo de certificado no pudo ser creado" },
			GET: { code: "TEMPLATE_GET", message: "El modelo de certificado no pudo ser obtenido" },
			EDIT: { code: "TEMPLATE_EDIT", message: "El modelo de certificado no pudo ser modificado" },
			DELETE: { code: "TEMPLATE_DELETE", message: "El modelo de certificado no pudo ser borrado" }
		}
	},
	VALIDATION: {
		INVALID_TOKEN: { code: "INVALID_TOKEN", message: "Token invalido" },
		NOT_ADMIN: { code: "NOT_ADMIN", message: "Esta operacion requiere privilegios de administrador" },
		TEMPLATE_DATA: {
			NO_DATA: function(type) {
				return { code: "NO_DATA", message: "el campo " + type + " no contiene data" };
			},
			INVALID_DATA: function(type) {
				return { code: "INVALID_DATA", message: "el campo " + type + " tiene un formato invalido" };
			},
			INVALID_TYPE: function(type) {
				return { code: "INVALID_TYPE", message: "el campo " + type + " tiene un tipo de dato invalido" };
			},
			MISSING_CHECKBOX_OPTIONS: function(type) {
				return {
					code: "MISSING_CHECKBOX_OPTIONS",
					message: "el campo " + type + " es de tipo 'checkbox' pero le falta el campo 'options'"
				};
			}
		},
		REQUESTER_IS: user => {
			return "The token corresponds to: " + user.name;
		},
		COMMON_PASSWORD: {
			code: "PARAMETER_TYPE_ERROR",
			message: "La contraseña ingresada es de uso común, por favor ingrese una mas segura."
		},
		DOES_NOT_EXIST: function(type) {
			return { code: "PARAMETER_MISSING", message: "falta el campo: " + type };
		},
		STRING_FORMAT_INVALID: function(field) {
			return {
				code: "PARAMETER_TYPE_ERROR",
				message: "el campo " + field + " es incorrecto, se esperaba un texto"
			};
		},
		LENGTH_INVALID: function(field, min, max) {
			const code = "PARAMETER_TYPE_ERROR";
			const msgStart = "el campo " + field + " tendria que tener";

			if (min && !max) {
				return {
					code: code,
					message: msgStart + " mas que " + min + " caracteres"
				};
			}

			if (!min && max) {
				return {
					code: code,
					message: msgStart + " menos que " + max + " caracteres"
				};
			}

			if (min == max) {
				return {
					code: code,
					message: msgStart + " exactamete " + max + " caracteres"
				};
			} else {
				return {
					code: code,
					message: msgStart + " entre " + min + " y " + max + " caracteres"
				};
			}
		}
	}
};
