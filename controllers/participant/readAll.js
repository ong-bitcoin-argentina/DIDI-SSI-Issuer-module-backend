/* eslint-disable max-len */
const ParticipantService = require('../../services/ParticipantService');
const ResponseHandler = require('../../routes/utils/ResponseHandler');

const readAll = async (_, res) => {
  // retorna true si en names hay algun nombre correspondiente a uno de los campos de partData
  const containsData = function containsData(partData, names) {
    return partData.data.find((data) => names.indexOf(data.name) >= 0) !== undefined;
  };

  try {
    const participants = await ParticipantService.getGlobalParticipants();
    const result = participants.map((partData) => ({
      did: partData.did,
      name: partData.name,

      // si tiene el tel, tiene el certificado de "telefono"
      tel: containsData(partData, ['Phone']),

      // si tiene el mail, tiene el certificado de "mail"
      mail: containsData(partData, ['email']),

      // si tiene el dni o nacionalidad, tiene el certificado de "info personal"
      personal: containsData(partData, ['dni', 'nationality']),

      // si tiene alguno de los campos asociados al certificado de direccion, tiene el certificado de "direccion"
      address: containsData(partData, [
        'streetAddress',
        'numberStreet',
        'floor',
        'department',
        'zipCode',
        'city',
        'municipality',
        'province',
        'country',
      ]),
    }));
    return ResponseHandler.sendRes(res, result);
  } catch (err) {
    return ResponseHandler.sendErr(res, err);
  }
};

module.exports = {
  readAll,
};
