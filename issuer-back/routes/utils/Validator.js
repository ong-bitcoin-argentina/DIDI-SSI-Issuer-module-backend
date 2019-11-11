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

let _doValidate = function(param, isBody) {
	let validation;

	let section = isBody ? body(param.name) : header(param.name);
	if (param.optional) {
		validation = section.optional();
	} else {
		validation = section
			.not()
			.isEmpty()
			.withMessage(Messages.VALIDATION.DOES_NOT_EXIST(param.name));
	}

	if (param.validate && param.validate.length) {
		param.validate.forEach(validationType => {
			switch (validationType) {
				case Constants.TOKEN_MATCHES_USER_ID:
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
					break;
				case Constants.VALIDATION_TYPES.IS_ADMIN:
					validation.custom(async function(token) {
						try {
							const user = await _getUserFromToken(token);
							if (user.type !== Constants.USER_TYPES.Admin) return Promise.reject(Messages.VALIDATION.NOT_ADMIN);

							return Promise.resolve(user);
						} catch (err) {
							return Promise.reject(err);
						}
					});
					break;
				case Constants.VALIDATION_TYPES.IS_PASSWORD:
					validation
						.not()
						.isIn(Constants.COMMON_PASSWORDS)
						.withMessage(Messages.VALIDATION.COMMON_PASSWORD);
					break;
				case Constants.VALIDATION_TYPES.IS_STRING:
					validation.isString().withMessage(Messages.VALIDATION.STRING_FORMAT_INVALID(param.name));
					break;
				case Constants.VALIDATION_TYPES.IS_TEMPLATE_DATA:
					validation.custom(data => {
						if (!data) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.NO_DATA(param.name));
						dataJson = JSON.parse(data);

						for (let dataElement of dataJson) {
							const missingField = !dataElement || !dataElement.name || !dataElement.type;
							if (missingField) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_DATA(param.name));

							const invalidType = !Constants.CERT_FIELD_TYPES[dataElement.type];
							if (invalidType) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));

							const checkboxMissingOptions =
								!dataElement.options && dataElement.type == Constants.CERT_FIELD_TYPES.Checkbox;
							if (checkboxMissingOptions)
								return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.MISSING_CHECKBOX_OPTIONS(param.name));
						}

						return Promise.resolve(data);
					});
					break;
				case Constants.IS_TEMPLATE_DATA_TYPE:
					validation.custom(data => {
						if (Object.values(Constants.DATA_TYPES).indexOf(data))
							return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA_TYPE.INVALID_DATA_TYPE(data));

						return Promise.resolve(data);
					});
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

module.exports.validateHead = function(params) {
	const validations = [];
	params.forEach(param => {
		validation = _doValidate(param, false);
		validations.push(validation);
	});
	return validations;
};

module.exports.validateBody = function(params) {
	const validations = [];
	params.forEach(param => {
		validation = _doValidate(param, true);
		validations.push(validation);
	});
	return validations;
};
