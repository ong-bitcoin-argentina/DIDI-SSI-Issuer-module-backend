/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
const ResponseHandler = require('../../routes/utils/ResponseHandler');
const Constants = require('../../constants/Constants');
const MouroService = require('../../services/MouroService');
const CertService = require('../../services/CertService');
const TemplateService = require('../../services/TemplateService');

// crea certificado y sus microcredenciales
const generateCertificate = async function generateCertificate(credentials, template, cert, part) {
  // generar microcredencial
  const generatePartialCertificate = async function generatePartialCertificate(name, certData, expDate, did) {
    try {
      const data = {};
      data[name] = {
        data: {},
      };

      certData.forEach((dataElem) => {
        if (
          dataElem.value !== undefined
          && dataElem.name !== Constants.CERT_FIELD_MANDATORY.DID
          && dataElem.name !== Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE
        ) data[name].data[dataElem.name] = dataElem.value;
      });

      const credential = await MouroService.createCertificate(data, expDate, did, template);
      return Promise.resolve(credential);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  try {
    const allData = cert.data.cert.concat(part).concat(cert.data.others);
    const name = cert.data.cert[0].value;
    const data = {};
    const microCreds = {};

    let did; let
      expDate;
    const allNames = [];
    const usedNames = [];

    // recorrer el certificado y obtener la info para cada microcredencial
    allData.forEach((dataElem) => {
      switch (dataElem.name) {
        case Constants.CERT_FIELD_MANDATORY.DID:
          did = dataElem.value;
          break;
        case Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE:
          expDate = dataElem.value;
          break;
        default:
          break;
      }

      for (const microCredData of cert.microCredentials) {
        const { names } = microCredData;
        if (names.indexOf(dataElem.name) >= 0) {
          if (!microCreds[microCredData.title]) microCreds[microCredData.title] = [];
          microCreds[microCredData.title].push(dataElem);
          usedNames.push(dataElem.name);
        }
      }
      allNames.push(dataElem.name);
    });

    const extra = [];
    allNames.forEach((n) => {
      if (usedNames.indexOf(n) < 0) extra.push(n);
    });

    extra.forEach((n) => {
      const dataElem = allData.find((elem) => elem.name === n);
      if (dataElem) {
        if (!microCreds['Otros Datos']) microCreds['Otros Datos'] = [];
        microCreds['Otros Datos'].push(dataElem);
      }
    });

    const generateCertPromises = [];
    const generateCertNames = Object.keys(microCreds);
    for (const microCredsName of generateCertNames) {
      const partialCert = generatePartialCertificate(microCredsName, microCreds[microCredsName], expDate, did);
      generateCertPromises.push(partialCert);
    }

    // crear las microcredenciales
    const microCredentials = await Promise.all(generateCertPromises);

    data[name] = MouroService.getSkeletonForEmmit(template, true);

    const saveCertPromises = [];
    const { registerId } = template;
    for (let i = 0; i < microCredentials.length; i++) {
      const microCred = microCredentials[i];
      const saveCred = MouroService.saveCertificate(microCred, false, registerId);
      saveCertPromises.push(saveCred);

      data[name].wrapped[generateCertNames[i]] = microCred;
    }

    const generateFull = MouroService.createCertificate(data, expDate, did, template);
    saveCertPromises.push(generateFull);

    // guardar microcredenciales y generar la macrocredencial
    const res = await Promise.all(saveCertPromises);

    for (let i = 0; i < res.length; i++) {
      if (i !== res.length - 1) {
        credentials.push(res[i]);
      } else {
        // guardar macrocredencial
        const savedFull = await MouroService.saveCertificate(res[i], true, registerId);
        credentials.push(savedFull);
      }
    }

    // retornal array con todas las credenciales generadas
    return Promise.resolve(credentials);
  } catch (err) {
    return Promise.reject(err);
  }
};

// crea certificado completo (sin microcredenciales)
const generateFullCertificate = async function generateFullCertificate(credentials, template, cert, part) {
  try {
    const allData = cert.data.cert.concat(part).concat(cert.data.others);
    const name = cert.data.cert[0].value;
    const data = {};
    data[name] = MouroService.getSkeletonForEmmit(template);

    let did; let
      expDate;
    allData.forEach((dataElem) => {
      switch (dataElem.name) {
        case Constants.CERT_FIELD_MANDATORY.DID:
          did = dataElem.value;
          break;
        case Constants.CERT_FIELD_MANDATORY.EXPIRATION_DATE:
          expDate = dataElem.value;
          break;
        default:
          data[name].data[dataElem.name] = dataElem.value;
          break;
      }
    });

    const { registerId } = template;

    const resFull = await MouroService.createCertificate(data, expDate, did, template);
    const savedFull = await MouroService.saveCertificate(resFull, true, registerId);
    credentials.push(savedFull);

    return Promise.resolve(credentials);
  } catch (err) {
    return Promise.reject(err);
  }
};

const emmitById = async (req, res) => {
  const { id } = req.params;
  let cert;
  try {
    cert = await CertService.getById(id);
    const template = await TemplateService.getById(cert.templateId);

    const partData = cert.data.participant.map((array) => array.map((data) => ({ value: data.value, name: data.name })));

    const credentials = [];
    // para cada participante, generar un cert, sus micro y guardarlos en mouro
    for (const part of partData) {
      // eslint-disable-next-line no-unused-expressions
      cert.split
        ? await generateCertificate(credentials, template, cert, part)
        : await generateFullCertificate(credentials, template, cert, part);
    }

    let result = cert;
    // actualizar estado en la bd local
    if (credentials.length) result = await CertService.emmit(cert, credentials);
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    console.log(err);
    if (err.message && cert) {
      const { data } = cert;
      const newMessage = `Certificado: ${data.cert[0].value} - Error: ${err.message}`;
      return ResponseHandler.sendErr(res, { ...err, message: newMessage });
    }
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  emmitById,
};
