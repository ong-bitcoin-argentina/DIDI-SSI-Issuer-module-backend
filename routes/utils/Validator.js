/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const { header, body, validationResult } = require('express-validator');
const Messages = require('../../constants/Messages');
const Constants = require('../../constants/Constants');
const ResponseHandler = require('./ResponseHandler');

const TemplateService = require('../../services/TemplateService');
const TokenService = require('../../services/TokenService');
const UserService = require('../../services/UserService');

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
  IS_NEW_PARTICIPANTS_DATA,
} = Constants.VALIDATION_TYPES;

// ejecuta validaciones generadas por "validate"
module.exports.checkValidationResult = function checkValidationResult(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  const err = result.array();
  return ResponseHandler.sendErr(res, { code: err[0].msg.code, message: err[0].msg.message });
};

// obtiene usuario del token
const _getUserFromToken = async function _getUserFromToken(token) {
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
const _doValidate = function _doValidate(param, isHead) {
  // inicializa validacion y valida existencia en caso de no ser opcional
  const createValidation = function createValidation(name, inHead, isOptional) {
    const section = inHead ? header(name) : body(name);
    if (isOptional) {
      return section.optional();
    }
    return section.not().isEmpty().withMessage(Messages.VALIDATION.DOES_NOT_EXIST(name));
  };

  // valida que el token corresponda al rol del usuario
  const validateTokenRole = function validateTokenRole(validation, role) {
    return validation.custom(async (token) => {
      try {
        const user = await _getUserFromToken(token);
        const { profile, isAdmin } = user;
        const types = profile ? profile.types : [];
        const allowed_roles = Constants.ALLOWED_ROLES[role];

        if (!isAdmin && !types.some((role_) => allowed_roles.includes(role_))) {
          return Promise.reject(Messages.VALIDATION.ROLES);
        }
        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    });
  };

  // obtiene usuario del token y verifica que sea valido
  const validateToken = function validateToken(validation) {
    return validation.custom(async (token, { req }) => {
      try {
        const user = await _getUserFromToken(token);
        if (req.params.userId && req.params.userId !== user._id) {
          return Promise.reject(Messages.VALIDATION.INVALID_TOKEN);
        }
        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    });
  };

  // valida que el campo sea un string
  const validateIsString = function validateIsString(validation, param) {
    return validation.isString().withMessage(Messages.VALIDATION.STRING_FORMAT_INVALID(param.name));
  };

  // valida que el campo sea un array
  const validateIsArray = function validateIsArray(validation, param) {
    return validation.custom(async (value) => {
      if (Array.isArray(value)) {
        return Promise.resolve(value);
      }
      return Promise.reject(Messages.VALIDATION.BOOLEAN_FORMAT_INVALID(param.name));
    });
  };

  // valida que el campo sea un boolean
  const validateIsBoolean = function validateIsBoolean(validation, param) {
    return validation.custom(async (value) => {
      if (value === 'true' || value === true || value === 'false' || value === false) {
        return Promise.resolve(value);
      }
      return Promise.reject(Messages.VALIDATION.BOOLEAN_FORMAT_INVALID(param.name));
    });
  };

  // valida que el campo no este en la lista de contraseñas comunes
  const validatePasswordIsNotCommon = function validatePasswordIsNotCommon(validation) {
    return validation.not().isIn(Constants.COMMON_PASSWORDS).withMessage(Messages.VALIDATION.COMMON_PASSWORD);
  };

  // valida que los tipos de datos sean los correctos
  const validateTemplateData = function validateTemplateData(validation, param) {
    return validation.custom((data) => {
      try {
        if (!data) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.NO_DATA(param.name));

        let dataJson;
        try {
          dataJson = JSON.parse(data);
        } catch (err) {
          return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
        }

        for (const type of Object.values(Constants.DATA_TYPES)) {
          for (const dataElement of dataJson[type]) {
            // si falta alguno de los campos
            const missingField = !dataElement || !dataElement.name || !dataElement.type;
            if (missingField) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_DATA(param.name));

            // si es de un tipo invalido
            const invalidType = !Constants.CERT_FIELD_TYPES[dataElement.type];
            if (invalidType) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));

            // si es de tipo checkbox, tiene opciones
            const checkboxMissingOptions = !dataElement.options && dataElement.type === Constants.CERT_FIELD_TYPES.Checkbox;
            if (checkboxMissingOptions) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.MISSING_CHECKBOX_OPTIONS(param.name));
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
  const validateTemplateDataType = function validateTemplateDataType(validation) {
    return validation.custom((data) => {
      try {
        if (Object.values(Constants.DATA_TYPES).indexOf(data) < 0) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA_TYPE.INVALID_DATA_TYPE(data));
        return Promise.resolve(data);
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    });
  };

  // valida que los valores se correspondan al tipo
  const validateValueMatchesType = async function validateValueMatchesType(type, value, err) {
    const date = new Date(value);
    const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(0[0-9]|1[0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9]Z)/;
    switch (type) {
      case Constants.CERT_FIELD_TYPES.Boolean:
        if (value !== 'true' && value !== 'false') return Promise.reject(err);
        break;
      case Constants.CERT_FIELD_TYPES.Date:
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
      default:
        break;
    }
    return Promise.resolve(value);
  };

  // valida que los valores sean validos
  const validateValueTypes = function validateValueTypes(validation, param) {
    return validation.custom(async (value, { req }) => {
      try {
        let data;
        const err = new Error('Error');
        try {
          data = JSON.parse(req.body.data);
        } catch (err) {
          return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
        }

        // sin tipo
        if (!data[0] || !data[0].type) return Promise.reject(err);

        const { type } = data[0];
        for (const dataElement of data) {
          const err = Messages.VALIDATION.TEMPLATE_DATA_VALUE.INVALID_DATA_VALUE(dataElement.name);

          // que el tipo sea el correcto
          if (!dataElement.type || type !== dataElement.type) return Promise.reject(err);

          // si es checkbox, que este entre las opciones
          if (type === Constants.CERT_FIELD_TYPES.Checkbox && !dataElement.options.includes(value)) return Promise.reject(err);
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
  const _doValidateValueInTemplate = async function _doValidateValueInTemplate(dataSection, templateDataSection) {
    try {
      for (const elem of dataSection) {
        const template = templateDataSection.find((template) => template.name === elem.name);
        if (!template) {
          // el campo no esta en el template
          return Promise.reject(Messages.VALIDATION.CERT_DATA.EXTRA_ELEMENT(elem.name));
        }
        const err = Messages.VALIDATION.TEMPLATE_DATA_VALUE.INVALID_DATA_VALUE(elem.name);

        // validar datos si estan o son requeridos
        if (elem.required || elem.value) await validateValueMatchesType(template.type, elem.value, err);
      }

      const allNames = dataSection.map((elem) => elem.name);

      for (const elem of templateDataSection) {
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
  const validatePartValueInTemplate = function validatePartValueInTemplate(validation, param) {
    return validation.custom(async (value, { req }) => {
      try {
        const { templateId } = req.body;
        const template = await TemplateService.getById(templateId);

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
  const validateValueInTemplate = function validateValueInTemplate(validation, param) {
    return validation.custom(async (value, { req }) => {
      try {
        const { templateId } = req.body;
        const template = await TemplateService.getById(templateId);

        let data;
        try {
          data = JSON.parse(req.body.data);
        } catch (err) {
          return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
        }

        const templateData = template.data;
        for (const key of Object.values(Constants.DATA_TYPES)) {
          if (key === Constants.DATA_TYPES.PARTICIPANT) {
            // PARTICIPANT DATA
            const templateDataSection = templateData[key];
            const dataSection = data[key];

            for (const section of dataSection) {
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
  const validateTemplatePreviewData = function validateTemplatePreviewData(validation, param) {
    return validation.custom(async (value, { req }) => {
      const { preview } = req.body;
      const { type } = req.body;

      let data;

      try {
        data = JSON.parse(req.body.data);
      } catch (err) {
        return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TYPE(param.name));
      }

      // largo invalido
      if (Constants.PREVIEW_ELEMS_LENGTH[type] !== preview.length) return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TEMPLATE_PREVIEW_TYPE);

      const templateData = data.cert
        .concat(data.participant)
        .concat(data.others)
        .filter((elem) => elem.required || elem.mandatory)
        .map((elem) => elem.name);

      for (const fieldName of preview) {
        if (templateData.indexOf(fieldName) < 0) {
          // campo a previsualizar no existe
          return Promise.reject(Messages.VALIDATION.TEMPLATE_DATA.INVALID_TEMPLATE_PREVIEW_DATA);
        }
      }

      return Promise.resolve(value);
    });
  };

  // validar microcredenciales
  const validateTemplateMicroCredData = function validateTemplateMicroCredData(validation, param) {
    return validation.custom(async (value, { req }) => {
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
        .map((elem) => elem.name);

      for (const microcredData of value) {
        for (const elem of microcredData.names) {
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
  const validateNewParticipantsData = function validateNewParticipantsData(validation, param) {
    return validation.custom(async (value, { req }) => {
      try {
        const { data } = req.body;
        for (const dataElem of data) {
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
    param.validate.forEach((validationType) => {
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
        default:
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
module.exports.validate = function validate(params) {
  const validations = [];
  params.forEach((param) => {
    const validation = _doValidate(param, param.isHead);
    validations.push(validation);
  });
  return validations;
};

module.exports.validateFile = function validateFile(req, res, next) {
  if (req.file) {
    const { size } = req.file;
    if (size > Constants.MAX_MB * 1000000) {
      return ResponseHandler.sendErrWithStatus(res, Messages.IMAGE.ERR.INVALID_SIZE);
    }
  }
  return next();
};
