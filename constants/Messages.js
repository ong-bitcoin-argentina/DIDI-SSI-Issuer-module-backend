module.exports = {
  INDEX: {
    ERR: {
      CONNECTION: 'Error de conexion en la base de datos: ',
    },
    MSG: {
      CONNECTING: 'conectandose a: ',
      CONNECTED: 'Base de datos conectada.',
      HELLO_WORLD: 'Hola DIDI!',
      RUNNING_ON: 'Ejecutandose en puerto ',
      STARTING_WORKER: 'Arrancando nuevo worker',
      STARTING_WORKERS: (num) => `Inicializando ${num} workers`,
      STARTED_WORKER: (pid) => `Worker ${pid} inicializado`,
      ENDED_WORKER: (pid, code, signal) => `Worker ${pid} termino con codigo: ${code}, y señal: ${signal}`,
    },
  },
  REGISTER: {
    ERR: {
      CREATE: { code: 'REGISTER_CREATE', message: 'El registro no pudo ser creado.' },
      NOT_EXIST: { code: 'NOT_EXIST', message: 'El registro no existe' },
      EDIT: {
        code: 'REGISTER_EDIT',
        message: 'El modelo de registro no pudo ser editado. Verifique que el registro haya sido creado con éxito.',
      },
      BLOCKCHAIN: { code: 'NOT_EXIST_BLOCKCHAIN', message: 'No existe la blockchain elegida.' },
      GET: { code: 'REGISTER_GET', message: 'El registro no pudo ser obtenido.' },
      SEND_SHARE_REQUEST: { code: 'REGISTER_GET', message: 'Error al enviar los pedidos de certificados de este emisor.' },
      GET_SHARE_REQUEST: { code: 'REGISTER_GET', message: 'No se pueden obtener los pedidos de certificados de este emisor.' },
      DID_EXISTS: { code: 'DID_EXISTS', message: 'Ya existe un registro con ese did.' },
      STATUS: { code: 'STATUS', message: 'El status no existe' },
      RETRY: { code: 'RETRY', message: 'Hubo un error al intentar validar el registro.' },
      INVALID_STATUS: {
        code: 'INVALID_STATUS',
        message: 'No se puede realizar esta acción con el estado actual del registro.',
      },
      NOT_BLOCKCHAIN: {
        code: 'NOT_BLOCKCHAIN',
        message: 'Error al emitir la credencial. El template que utiliza la credencial NO tiene una blockchain asignada. Por favor, configure la blockchain de verificación en el template.',
      },
      STATUS_NOT_VALID: {
        code: 'STATUS_NOT_VALID',
        message: 'No se puede realizar esta accion, debido al estado del registro.',
      },
      REFRESH: {
        code: 'REGISTER_REFRESH',
        message: 'No se pudo actualizar el registro.',
      },
      NAME_EXIST: {
        code: 'NAME_EXIST',
        message: 'Ya existe el nombre para la misma blockchain.',
      },
      INVALID_DID: {
        code: 'INVALID_DID',
        message: 'El did es inválido.',
      },
      INVALID_PRIVATE_KEY: {
        code: 'INVALID_PRIVATE_KEY',
        message: 'La clave privada es inválida.',
      },
      INVALID_DID_AND_KEY: {
        code: 'INVALID_DID_AND_KEY',
        message: 'Hubo un error al validar el did y la clave privada.',
      },
      TOKEN: {
        code: 'TOKEN_ERROR',
        message: 'Hubo un error al crear del Token de autorización.',
      },
    },
  },
  DELEGATE: {
    ERR: {
      NOT_EXIST: { code: 'NOT_EXIST', message: 'El delegado no existe.' },
      SET_NAME: { code: 'SET_NAME', message: 'No se pudo actualizar el nombre del emisor.' },
      GET_NAME: { code: 'GET_NAME', message: 'No se pudo obtener el nombre del emisor.' },
      DELEGATE: {
        code: 'DELEGATE',
        message: 'No se pudo realizar la delegación. Por favor, compruebe que el DID emisor tiene tokens disponibles para ejecutar la transacción en la blockchain',
      },
      CREATE: { code: 'DELEGATE_CREATE', message: 'El delegado no pudo ser creado.' },
      GET: { code: 'DELEGATE_GET', message: 'El delegado no pudo ser obtenido.' },
      DELETE: { code: 'DELEGATE_DELETE', message: 'El delegado no pudo ser borrado.' },
    },
  },
  PROFILE: {
    ERR: {
      GET: { code: 'PROFILE_GET', message: 'No se encontro el Perfil.' },
      NAME_NOT_UNIQUE: { code: 'NAME_NOT_UNIQUE', message: 'El nombre del perfil ya existe.' },
      IS_USED: {
        code: 'PROFILE_IS_USED',
        message: 'El perfil que se desea borrar lo estan usando los siguientes usuarios: ',
      },
    },
  },
  USER: {
    ERR: {
      INVALID_USER: { code: 'INVALID_USER', message: 'El usuario y contraseña no coinciden.' },
      CREATE: { code: 'USER_CREATE', message: 'El usuario no pudo ser creado.' },
      GET: { code: 'USER_GET', message: 'El usuario no pudo ser obtenido.' },
      SET_NAME: { code: 'DELEGATE_SET_NAME', message: 'El delegado no pudo ser verificado.' },
      GET_NAME: { code: 'DELEGATE_GET_NAME', message: 'El nombre del emisor no pudo ser obtenido.' },
      UNIQUE_NAME: { code: 'UNIQUE_NAME', message: 'El nombre del usuario ya existe.' },
      TYPE: { code: 'INVALID_TYPE', message: 'El tipo elegido para el usuario no es valido.' },
      DELETE: { code: 'USER_DELETE', message: 'El modelo de usuario no pudo ser borrado.' },
      EDIT: { code: 'USER_EDIT', message: 'El modelo de usuario no pudo ser editado.' },
    },
  },
  IMAGE: {
    ERR: {
      NOT_EXIST: { code: 'NOT_EXIST', message: 'No existe la imagen.' },
    },
    DELETE: { code: 'IMG_DELETE', message: 'Imagen eliminada.' },
  },
  CERT: {
    ERR: {
      EMMIT: { code: 'CERT_EMMIT', message: 'El certificado no pudo ser emitido.' },
      CREATE: { code: 'CERT_CREATE', message: 'El certificado no pudo ser creado.' },
      GET: { code: 'CERT_GET', message: 'El certificado no pudo ser obtenido.' },
      EDIT: { code: 'CERT_EDIT', message: 'El certificado no pudo ser modificado.' },
      DELETE: { code: 'CERT_DELETE', message: 'El certificado no pudo ser borrado.' },
      REVOKE: { code: 'CERT_REVOKE', message: 'El certificado no pudo ser revocado.' },
    },
  },
  PARTICIPANT: {
    ERR: {
      CREATE: { code: 'PARTICIPANT_CREATE', message: 'El modelo de participante no pudo ser creado.' },
      GET: { code: 'PARTICIPANT_GET', message: 'El modelo de participante no pudo ser obtenido.' },
      EDIT: { code: 'PARTICIPANT_EDIT', message: 'El modelo de participante no pudo ser modificado.' },
      DELETE: { code: 'PARTICIPANT_DELETE', message: 'El modelo de participante no pudo ser borrado.' },
    },
  },
  SHARE_REQ: {
    ERR: {
      CREATE: { code: 'SHARE_REQ_CREATE', message: 'El pedido de certificados no pudo ser creado.' },
      SEND: { code: 'SHARE_REQ_SEND', message: 'El pedido de certificados no pudo ser enviado.' },
      NOT_EXIST: { code: 'SHARE_REQ_NOT_EXIST', message: 'No existe el pedido de certificados.' },
      DELETE: { code: 'SHARE_REQ_DELETE', message: 'El pedido de certificados no pudo ser borrado.' },
      CERT_TYPES: { code: 'SHARE_REQ_CERT_TYPES', message: 'Una categoria de credencial no es valida' },
    },
  },
  TEMPLATE: {
    ERR: {
      CREATE: { code: 'TEMPLATE_CREATE', message: 'El modelo de certificado no pudo ser creado.' },
      GET: { code: 'TEMPLATE_GET', message: 'El modelo de certificado no pudo ser obtenido.' },
      EDIT: { code: 'TEMPLATE_EDIT', message: 'El modelo de certificado no pudo ser modificado.' },
      DELETE: { code: 'TEMPLATE_DELETE', message: 'El modelo de certificado no pudo ser borrado.' },
      UNIQUE_NAME: {
        code: 'UNIQUE_NAME',
        message: 'Error al Crear el Template: El nombre elegido ya existe. Por favor, vuelva a intentarlo con un nombre diferente.',
      },
    },
  },
  CERTIFICATE: {
    CREATED: 'Certificado creado',
    VERIFIED: 'Certificado verificado',
    SAVED: 'Certificado guardado',
    ERR: {
      VERIFY: { code: 'CERT_VERIFY_ERROR', message: 'Error al validar la credencial.' },
    },
    CERT_FIELDS: {
      NAME: 'CREDENCIAL',
      PARTICIPANT_NAME: 'NOMBRE',
      PARTICIPANT_LAST_NAME: 'APELLIDO',
    },
  },
  VALIDATION: {
    INVALID_TOKEN: { code: 'INVALID_TOKEN', message: 'Token invalido.' },
    ROLES: { code: 'PERMISSION_DENIED', message: 'Esta operacion requiere privilegios que no tienes.' },
    TEMPLATE_DATA_TYPE: {
      INVALID_DATA_TYPE(data) {
        return { code: 'INVALID_DATA_TYPE', message: `${data} no es una sección válida del certificado.` };
      },
    },
    TEMPLATE_DATA_VALUE: {
      INVALID_DATA_VALUE(type) {
        return {
          code: 'INVALID_DATA_VALUE',
          message: `el campo ${type} contiene un valor invalido.`,
        };
      },
    },
    TEMPLATE_DATA: {
      INVALID_TEMPLATE_PREVIEW_TYPE: {
        code: 'INVALID_TEMPLATE_PREVIEW_TYPE',
        message: 'Se permiten actualmente solo 2, 4 o 6 campos para previsualizar.',
      },
      INVALID_TEMPLATE_ID: { code: 'INVALID_TEMPLATE_ID', message: 'No existe modelo de certificado con ese id.' },
      INVALID_TEMPLATE_PREVIEW_DATA: {
        code: 'INVALID_TEMPLATE_PREVIEW_DATA',
        message: 'El modelo de certificado no contiene los tipos requeridos.',
      },
      NO_DATA(type) {
        return { code: 'NO_DATA', message: `El campo ${type} no contiene datos.` };
      },
      INVALID_DATA(type) {
        return { code: 'INVALID_DATA', message: `El campo ${type} tiene un formato invalido.` };
      },
      INVALID_TYPE(type) {
        return { code: 'INVALID_TYPE', message: `El campo ${type} tiene un tipo de dato invalido.` };
      },
      MISSING_CHECKBOX_OPTIONS(type) {
        return {
          code: 'MISSING_CHECKBOX_OPTIONS',
          message: `El campo ${type} es de tipo 'checkbox' pero falta el campo 'options'.`,
        };
      },
    },
    CERT_DATA: {
      INVALID_MICROCRED_DATA(name) {
        return {
          code: 'INVALID_MICROCRED_DATA',
          message: `El campo ${name} no puede ser parte de una microcredencial, no se encuentra en el certificado.`,
        };
      },
      INVALID_TEMPLATE_ID(type) {
        return { code: 'INVALID_TEMPLATE_ID', message: `El campo ${type} es inválido.` };
      },
      EXTRA_ELEMENT(name) {
        return { code: 'EXTRA_ELEMENT', message: `El campo ${name} no se encuentra en el modelo de certificado.` };
      },
      MISSING_ELEMENT(name) {
        return { code: 'MISSING_ELEMENT', message: `El campo ${name} está faltando en el certificado.` };
      },
    },
    REQUESTER_IS: (user) => `El token le pertenece a: ${user.name}`,
    COMMON_PASSWORD: {
      code: 'COMMON_PASSWORD',
      message: 'La contraseña ingresada es de uso común, por favor ingrese una mas segura.',
    },
    DOES_NOT_EXIST(type) {
      return { code: 'PARAMETER_MISSING', message: `Falta el campo: ${type}` };
    },
    STRING_FORMAT_INVALID(field) {
      return {
        code: 'PARAMETER_TYPE_ERROR',
        message: `El campo ${field} es incorrecto, se esperaba un texto.`,
      };
    },
    LENGTH_INVALID(field, min, max) {
      const code = 'PARAMETER_TYPE_ERROR';
      const msgStart = `El campo ${field} tendria que tener.`;

      if (min && !max) {
        return {
          code,
          message: `${msgStart} mas que ${min} caracteres.`,
        };
      }

      if (!min && max) {
        return {
          code,
          message: `${msgStart} menos que ${max} caracteres.`,
        };
      }

      if (min === max) {
        return {
          code,
          message: `${msgStart} exactamente ${max} caracteres.`,
        };
      }
      return {
        code,
        message: `${msgStart} entre ${min} y ${max} caracteres.`,
      };
    },
  },
};
