const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const ResponseHandler = require("./ResponseHandler");
const { header, body, validationResult } = require("express-validator");

const TokenService = require("../../services/TokenService");
const UserService = require("../../services/UserService");

module.exports.checkValidationResult = function(req, res, next) {
	const result = validationResult(req);
	if (result.isEmpty()) {
		return next();
	}
	const err = result.array();
	return ResponseHandler.sendErr(res, { code: err[0].msg.code, message: err[0].msg.message });
};

let _getUserFromToken = async function(token) {
	const data = TokenService.getTokenData(token);
	try {
		const user = await UserService.getById(data.userId);
		if (!user) return Promise.reject(Messages.VALIDATION.INVALID_TOKEN);
		if (Constants.DEBUGG) console.log(Messages.VALIDATION.REQUESTER_IS(user));
		return Promise.resolve(user);
	} catch (err) {
		console.log(err);
		return Promise.reject(Messages.VALIDATION.INVALID_TOKEN);
	}
};

let _doValidate = function(param, isHead) {
	let createValidation = function(name, isHead, isOptional) {
		let section = isHead ? header(name) : body(name);
		if (isOptional) {
			return section.optional();
		} else {
			return section
				.not()
				.isEmpty()
				.withMessage(Messages.VALIDATION.DOES_NOT_EXIST(name));
		}
	};

	let validateToken = function(validation) {
		validation.custom(async function(token, { req }) {
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

	let validateTokenCorrespondsToAdmin = function(validation) {
		validation.custom(async function(token) {
			try {
				const user = await _getUserFromToken(token);
				if (user.type !== Constants.USER_TYPES.Admin) return Promise.reject(Messages.VALIDATION.NOT_ADMIN);

				return Promise.resolve(user);
			} catch (err) {
				return Promise.reject(err);
			}
		});
	};

	let validateIsString = function(validation, param) {
		validation.isString().withMessage(Messages.VALIDATION.STRING_FORMAT_INVALID(param.name));
	};

	let validatePasswordIsNotCommon = function(validation) {
		validation
			.not()
			.isIn(Constants.COMMON_PASSWORDS)
			.withMessage(Messages.VALIDATION.COMMON_PASSWORD);
	};

	let validateTemplateData = function(validation, param) {
		validation.custom(data => {
			if (!data) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.NO_DATA(param.name));
			const dataJson = JSON.parse(data);

			for (let dataElement of dataJson) {
				const missingField = !dataElement || !dataElement.name || !dataElement.type;
				if (missingField) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_DATA(param.name));

				const invalidType = !Constants.CERT_FIELD_TYPES[dataElement.type];
				if (invalidType) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));

				const checkboxMissingOptions = !dataElement.options && dataElement.type == Constants.CERT_FIELD_TYPES.Checkbox;
				if (checkboxMissingOptions)
					return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.MISSING_CHECKBOX_OPTIONS(param.name));
			}
			return Promise.resolve(data);
		});
	};

	let validateTemplateDataType = function(validation) {
		validation.custom(data => {
			if (Object.values(Constants.DATA_TYPES).indexOf(data))
				return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA_TYPE.INVALID_DATA_TYPE(data));
			return Promise.resolve(data);
		});
	};

	let validateValueMatchesType = function(type, value, err) {
		switch (type) {
			case Constants.CERT_FIELD_TYPES.Boolean:
				if (value !== "true" && value !== "fakse") return Promise.reject(err);
				break;
			case Constants.CERT_FIELD_TYPES.Date:
				const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0[0-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9]Z)/;
				if (!value.match(regex)) return Promise.reject(err);
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

	let validateValueTypes = function(validation, param) {
		validation.custom((value, { req }) => {
			const data = JSON.parse(req.body.data);
			const err = Messages.VALIDATION.TEMPLATE_DATA_TYPE.INVALID_DATA_VALUE(param.name);

			if (!data[0] || !data[0]["type"]) return Promise.reject(err);

			let type = data[0]["type"];
			for (let dataElement of data) {
				if (!dataElement["type"] || type != dataElement["type"]) return Promise.reject(err);
				if (type == Constants.CERT_FIELD_TYPES.Checkbox && !dataElement.options.includes(value))
					return Promise.reject(err);
			}

			validateValueMatchesType(type, value, err);
			return Promise.resolve(value);
		});
	};

	let validateValueInTemplate = function(validation, param) {
		validation.custom(async function(value, { req }) {
			const templateId = JSON.parse(req.body.templateId);
			let template;
			try {
				template = await TemplateService.getById(templateId);
				if (!template) return Promise.reject(Messages.VALIDATION.CERT_DATA(param.name));
			} catch (err) {
				return Promise.reject(err);
			}
			const data = JSON.parse(req.body.certData);

			const templateData = template.data;

			for (let key in Object.keys(templateData)) {
				const dataSection = data[key];
				const templateDataSection = templateData[key];

				const allTemplateNames = templateDataSection.map(elem => elem.name);
				dataSection.forEach(elem => {
					const template = templateDataSection.find(template => template.name === elem.name);
					if (!template)
						return Promise.reject(Messages.VALIDATION.EXTRA_ELEMENT(elem.name));
					validateValueMatchesType(template.type, elem.value, err);
				});

				const allNames = dataSection.map(elem => elem.name);
				templateDataSection.forEach(elem => {
					if (elem.required && !allNames.contains(elem.name))
						return Promise.reject(Messages.VALIDATION.MISSING_ELEMENT(elem.name));
				});
			}
			return Promise.resolve(value);
		});
	};

	let validation = createValidation(param.name, isHead, param.optional);

	if (param.validate && param.validate.length) {
		param.validate.forEach(validationType => {
			switch (validationType) {
				case Constants.TOKEN_MATCHES_USER_ID:
					validateToken(validation);
					break;
				case Constants.VALIDATION_TYPES.IS_ADMIN:
					validateTokenCorrespondsToAdmin(validation);
					break;
				case Constants.VALIDATION_TYPES.IS_PASSWORD:
					validatePasswordIsNotCommon(validation);
					break;
				case Constants.VALIDATION_TYPES.IS_STRING:
					validateIsString(validation, param);
					break;
				case Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA:
					validateTemplateData(validation, param);
					break;
				case Constants.IS_TEMPLATE_DATA_TYPE:
					validateTemplateDataType(validation);
					break;
				case Constants.IS_TEMPLATE_DATA_VALUE:
					validateValueTypes(validation, param);
					break;
				case Constants.IS_CERT_DATA:
					validateValueInTemplate(validation, param);
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

module.exports.validate = function(params) {
	const validations = [];
	params.forEach(param => {
		validation = _doValidate(param, param.isHead);
		validations.push(validation);
	});
	return validations;
};
