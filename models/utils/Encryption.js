/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const NodeRSA = require('node-rsa');
const Constants = require('../../constants/Constants');

const key = new NodeRSA(Constants.RSA_PRIVATE_KEY);

// clase utilitaria para encriptar utilizando el algoritmo "rsa"
class Encrypt {
  // encripta la data usando la clave recibida en "RSA_PRIVATE_KEY"
  static async encrypt(data) {
    const encrypted = key.encrypt(data, 'base64');
    return encrypted;
  }

  // des-encripta la data encriptada usando la clave "RSA_PRIVATE_KEY"
  static async decript(encrypted) {
    const data = key.decrypt(encrypted, 'utf8');
    return data;
  }

  // encripta & hashea la data, guarda el resultado dentro del modelo
  // si "saltData" es true, se genera un salt, sino se utiliza el global
  // (esto permite busquedas por estos campos en la base de datos aunque reduce grado de seguridad)
  static async setEncryptedData(model, name, data) {
    try {
      const encrypted = await Encrypt.encrypt(data);
      model[name] = encrypted;
      return Promise.resolve(model);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  // desencripta el campo indicado y retorna la data
  static async getEncryptedData(model, name) {
    try {
      const encrypted = model[name];
      const data = await Encrypt.decript(encrypted);
      return Promise.resolve(data);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
}

module.exports = Encrypt;
