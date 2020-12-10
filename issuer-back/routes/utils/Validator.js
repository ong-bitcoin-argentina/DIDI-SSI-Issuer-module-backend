const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const ResponseHandler = require("./ResponseHandler");
const { header, body, validationResult } = require("express-validator");

const TemplateService = require("../../services/TemplateService");
const TokenService = require("../../services/TokenService");
const UserService = require("../../services/UserService");
const { USER_TYPES } = require("../../constants/Constants");

const { Admin } = Constants.USER_TYPES;
const {
	IS_PASSWORD,
	IS_STRING,
	IS_ARRAY,
	IS_BOOLEAN,
	IS_TEMPLATE_DATA,
	IS_TEMPLATE_DATA_TYPE,
	IS_TEMPLATE_DATA_VALUE,
	IS_CERT_DATA,
	IS_PART_DATA,
	IS_TEMPLATE_PREVIEW_DATA,
	IS_CERT_MICRO_CRED_DATA,
	IS_NEW_PARTICIPANTS_DATA
} = Constants.VALIDATION_TYPES;

// ejecuta validaciones generadas por "validate"
module.exports.checkValidationResult = function (req, res, next) {
	const result = validationResult(req);
	if (result.isEmpty()) {
		return next();
	}
	const err = result.array();
	return ResponseHandler.sendErr(res, { code: err[0].msg.code, message: err[0].msg.message });
};

// obtiene usuario del token
let _getUserFromToken = async function (token) {
	try {
		const data = TokenService.getTokenData(token);
		console.log(data);
		const user = await UserService.getById(data.userId);
		console.log(user);
		if (!user) return Promise.reject(Messages.VALIDATION.INVALID_TOKEN);
		if (Constants.DEBUGG) console.log(Messages.VALIDATION.REQUESTER_IS(user));
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.VALIDATION.INVALID_TOKEN);
	}
};

// ejecuta validacion para un parametro en particular
let _doValidate = function (param, isHead) {
	// inicializa validacion y valida existencia en caso de no ser opcional
	let createValidation = function (name, isHead, isOptional) {
		let section = isHead ? header(name) : body(name);
		if (isOptional) {
			return section.optional();
		} else {
			return section.not().isEmpty().withMessage(Messages.VALIDATION.DOES_NOT_EXIST(name));
		}
	};

	// valida que el token corresponda al rol del usuario
	let validateTokenRole = function (validation, role) {
		return validation.custom(async function (token) {
			try {
				const user = await _getUserFromToken(token);
				const allowed_roles = [Admin, ...Constants.ALLOWED_ROLES[role]];

				if (!user.types.some(role_ => allowed_roles.includes(role_))) {
					return Promise.reject(Messages.VALIDATION.ROLES);
				}
				return Promise.resolve(user);
			} catch (err) {
				return Promise.reject(err);
			}
		});
	};

	// obtiene usuario del token y verifica que sea valido
	let validateToken = function (validation) {
		return validation.custom(async function (token, { req }) {
			try {
				const user = await _getUserFromToken(token);
				if (req.params.userId && req.params.userId != user._id) {
					return Promise.reject(Messages.VALIDATION.INVALID_TOKEN);
				}
				return Promise.resolve(user);
			} catch (err) {
				return Promise.reject(err);
			}
		});
	};

	// valida que el campo sea un string
	let validateIsString = function (validation, param) {
		return validation.isString().withMessage(Messages.VALIDATION.STRING_FORMAT_INVALID(param.name));
	};

	// valida que el campo sea un array
	let validateIsArray = function (validation, param) {
		return validation.custom(async function (value) {
			if (Array.isArray(value)) {
				return Promise.resolve(value);
			} else {
				return Promise.reject(Messages.VALIDATION.BOOLEAN_FORMAT_INVALID(param.name));
			}
		});
	};

	// valida que el campo sea un boolean
	let validateIsBoolean = function (validation, param) {
		return validation.custom(async function (value) {
			if (value === "true" || value === true || value === "false" || value === false) {
				return Promise.resolve(value);
			} else {
				return Promise.reject(Messages.VALIDATION.BOOLEAN_FORMAT_INVALID(param.name));
			}
		});
	};

	// valida que el campo no este en la lista de contraseñas comunes
	let validatePasswordIsNotCommon = function (validation) {
		return validation.not().isIn(Constants.COMMON_PASSWORDS).withMessage(Messages.VALIDATION.COMMON_PASSWORD);
	};

	// valida que los tipos de datos sean los correctos
	let validateTemplateData = function (validation, param) {
		return validation.custom(data => {
			try {
				if (!data) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.NO_DATA(param.name));

				let dataJson;
				try {
					dataJson = JSON.parse(data);
				} catch (err) {
					return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
				}

				for (let type of Object.values(Constants.DATA_TYPES)) {
					for (let dataElement of dataJson[type]) {
						// si falta alguno de los campos
						const missingField = !dataElement || !dataElement.name || !dataElement.type;
						if (missingField) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_DATA(param.name));

						// si es de un tipo invalido
						const invalidType = !Constants.CERT_FIELD_TYPES[dataElement.type];
						if (invalidType) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));

						// si es de tipo checkbox, tiene opciones
						const checkboxMissingOptions =
							!dataElement.options && dataElement.type == Constants.CERT_FIELD_TYPES.Checkbox;
						if (checkboxMissingOptions)
							return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.MISSING_CHECKBOX_OPTIONS(param.name));
					}
				}

				return Promise.resolve(data);
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
		});
	};

	// valida que los tipos de datos sean validos
	let validateTemplateDataType = function (validation) {
		return validation.custom(data => {
			try {
				if (Object.values(Constants.DATA_TYPES).indexOf(data) < 0)
					return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA_TYPE.INVALID_DATA_TYPE(data));
				return Promise.resolve(data);
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
		});
	};

	// valida que los valores se correspondan al tipo
	let validateValueMatchesType = async function (type, value, err) {
		switch (type) {
			case Constants.CERT_FIELD_TYPES.Boolean:
				if (value !== "true" && value !== "false") return Promise.reject(err);
				break;
			case Constants.CERT_FIELD_TYPES.Date:
				const date = new Date(value);
				const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0[0-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9]Z)/;
				if (!date.toISOString().match(regex)) return Promise.reject(err);
				break;
			case Constants.CERT_FIELD_TYPES.Number:
				if (isNaN(value)) return Promise.reject(err);
				break;
			case Constants.CERT_FIELD_TYPES.Paragraph:
				if (!value) return Promise.reject(err);
				break;
			case Constants.CERT_FIELD_TYPES.Text:
				if (!value) return Promise.reject(err);
				break;
		}
		return Promise.resolve(value);
	};

	// valida que los valores sean validos
	let validateValueTypes = function (validation, param) {
		return validation.custom(async (value, { req }) => {
			try {
				let data;

				try {
					data = JSON.parse(req.body.data);
				} catch (err) {
					return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
				}

				// sin tipo
				if (!data[0] || !data[0]["type"]) return Promise.reject(err);

				let type = data[0]["type"];
				for (let dataElement of data) {
					const err = Messages.VALIDATION.TEMPLATE_DATA_VALUE.INVALID_DATA_VALUE(elem.name);

					// que el tipo sea el correcto
					if (!dataElement["type"] || type != dataElement["type"]) return Promise.reject(err);

					// si es checkbox, que este entre las opciones
					if (type == Constants.CERT_FIELD_TYPES.Checkbox && !dataElement.options.includes(value))
						return Promise.reject(err);
				}

				// validar datos si estan o son requeridos
				if (data[0].required || value) await validateValueMatchesType(type, value, err);
				return Promise.resolve(value);
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
		});
	};

	// validar seccion del certificado comparandola con la del modelo
	let _doValidateValueInTemplate = async function (dataSection, templateDataSection) {
		try {
			for (let elem of dataSection) {
				const template = templateDataSection.find(template => template.name === elem.name);
				if (!template) {
					// el campo no esta en el template
					return Promise.reject(Messages.VALIDATION.CERT_DATA.EXTRA_ELEMENT(elem.name));
				}
				const err = Messages.VALIDATION.TEMPLATE_DATA_VALUE.INVALID_DATA_VALUE(elem.name);

				// validar datos si estan o son requeridos
				if (elem.required || elem.value) await validateValueMatchesType(template.type, elem.value, err);
			}

			const allNames = dataSection.map(elem => elem.name);

			for (let elem of templateDataSection) {
				if (elem.required && allNames.indexOf(elem.name) < 0) {
					// el campo esta en el template y es requerido, pero no esta
					return Promise.reject(Messages.VALIDATION.MISSING_ELEMENT(elem.name));
				}
			}

			return Promise.resolve();
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
	};

	// validar valor dentro del modelo de certificado
	let validatePartValueInTemplate = function (validation, param) {
		return validation.custom(async function (value, { req }) {
			try {
				const templateId = req.body.templateId;
				let template = await TemplateService.getById(templateId);

				let data;
				try {
					data = JSON.parse(req.body.data);
				} catch (err) {
					console.log(err);
					return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
				}

				await _doValidateValueInTemplate(data, template.data.participant);
				return Promise.resolve(value);
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
		});
	};

	// validar data dentro del modelo
	let validateValueInTemplate = function (validation, param) {
		return validation.custom(async function (value, { req }) {
			try {
				const templateId = req.body.templateId;
				let template = await TemplateService.getById(templateId);

				let data;
				try {
					data = JSON.parse(req.body.data);
				} catch (err) {
					return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
				}

				const templateData = template.data;
				for (let key of Object.values(Constants.DATA_TYPES)) {
					if (key === Constants.DATA_TYPES.PARTICIPANT) {
						// PARTICIPANT DATA
						const templateDataSection = templateData[key];
						const dataSection = data[key];

						for (let section of dataSection) {
							await _doValidateValueInTemplate(section, templateDataSection);
						}
					} else {
						// CERT DATA && OTHERS DATA
						const dataSection = data[key];
						const templateDataSection = templateData[key];
						await _doValidateValueInTemplate(dataSection, templateDataSection);
					}
				}
				return Promise.resolve(value);
			} catch (err) {
				console.log(err);
				return Promise.reject(err);
			}
		});
	};

	// validar campos a previsualizar del certificado
	let validateTemplatePreviewData = function (validation, param) {
		return validation.custom(async function (value, { req }) {
			const preview = req.body.preview;
			const type = req.body.type;

			let data;

			try {
				data = JSON.parse(req.body.data);
			} catch (err) {
				return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
			}

			// largo invalido
			if (Constants.PREVIEW_ELEMS_LENGTH[type] !== preview.length)
				return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TEMPLATE_PREVIEW_TYPE);

			const templateData = data.cert
				.concat(data.participant)
				.concat(data.others)
				.filter(elem => elem.required || elem.mandatory)
				.map(elem => elem.name);

			for (let fieldName of preview) {
				if (templateData.indexOf(fieldName) < 0) {
					// campo a previsualizar no existe
					return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TEMPLATE_PREVIEW_DATA);
				}
			}

			return Promise.resolve(value);
		});
	};

	// validar microcredenciales
	let validateTemplateMicroCredData = function (validation, param) {
		return validation.custom(async function (value, { req }) {
			let data;

			if (!req.body.split) return Promise.resolve(value);

			try {
				data = JSON.parse(req.body.data);
			} catch (err) {
				return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
			}

			const certData = data.cert
				.concat(data.participant[0])
				.concat(data.others)
				.map(elem => elem.name);

			for (let microcredData of value) {
				for (let elem of microcredData.names) {
					if (certData.indexOf(elem) < 0) {
						// campo a agregar en la micro no existe
						return Promise.reject(Messages.VALIDATION.CERT_DATA.INVALID_MICROCRED_DATA(elem));
					}
				}
			}
			return Promise.resolve(value);
		});
	};

	// validar data nueva de participante
	let validateNewParticipantsData = function (validation, param) {
		return validation.custom(async function (value, { req }) {
			try {
				const data = req.body.data;
				for (let dataElem of data) {
					if (!dataElem.did) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
				}
			} catch (err) {
				console.log(err);
				return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
			}
		});
	};

	let validation = createValidation(param.name, isHead, param.optional);

	if (param.validate && param.validate.length) {
		param.validate.forEach(validationType => {
			switch (validationType) {
				case Constants.TOKEN_MATCHES_USER_ID:
					validation = validateToken(validation);
					break;
				case Constants.USER_TYPES[validationType]:
					validation = validateTokenRole(validation, Constants.USER_TYPES[validationType]);
					break;
				case IS_PASSWORD:
					validation = validatePasswordIsNotCommon(validation);
					break;
				case IS_STRING:
					validation = validateIsString(validation, param);
					break;
				case IS_ARRAY:
					validation = validateIsArray(validation, param);
					break;
				case IS_BOOLEAN:
					validation = validateIsBoolean(validation, param);
					break;
				case IS_TEMPLATE_DATA:
					validation = validateTemplateData(validation, param);
					break;
				case IS_TEMPLATE_DATA_TYPE:
					validation = validateTemplateDataType(validation);
					break;
				case IS_TEMPLATE_DATA_VALUE:
					validation = validateValueTypes(validation, param);
					break;
				case IS_CERT_DATA:
					validation = validateValueInTemplate(validation, param);
					break;
				case IS_PART_DATA:
					validation = validatePartValueInTemplate(validation, param);
					break;
				case IS_TEMPLATE_PREVIEW_DATA:
					validation = validateTemplatePreviewData(validation, param);
					break;
				case IS_CERT_MICRO_CRED_DATA:
					validation = validateTemplateMicroCredData(validation, param);
					break;
				case IS_NEW_PARTICIPANTS_DATA:
					validation = validateNewParticipantsData(validation, param);
					break;
			}
		});
	}

	if (param.length) {
		validation
			.isLength(param.length)
			.withMessage(Messages.VALIDATION.LENGTH_INVALID(param.name, param.length.min, param.length.max));
	}

	return validation;
};

// recibe una lista de parámetros de validacion y valida que los datos recibidos en el body y header
// cumplan con esos parametros
module.exports.validate = function (params) {
	const validations = [];
	params.forEach(param => {
		validation = _doValidate(param, param.isHead);
		validations.push(validation);
	});
	return validations;
};
