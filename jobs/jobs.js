/* eslint-disable no-new */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const { decodeJWT } = require('../services/BlockchainService');
const ShareResponse = require('../models/ShareResponse');
const { SHARERESPONSE_PROCESS_STATUS } = require('../constants/Constants');

const SECONDS = '0';
const MINUTES = '*/2';
const HOURS = '*';
const DAY_OF_MONTH = '*';
const MONTH = '*';
const DAY_OF_WEEK = '*';

const processCallbackShareResponseEmitter = async () => {
  // Se ejecutan de a 5
  const shareResponses = await ShareResponse.find({
    process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_EMITTER,
    errorMessage: {
      $exists: false,
    },
  })
    .sort({ createdOn: -1 })
    .limit(5);
  // eslint-disable-next-line no-console
  for (const shareResponse of shareResponses) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      await shareResponse.edit({ process_status: SHARERESPONSE_PROCESS_STATUS.PROCESSED });
    } catch (error) {
      await shareResponse.edit({ errorMessage: 'Error' });
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

const callbackShareResponseEmitterJob = (frequency) => {
  new CronJob(
    frequency,
    processCallbackShareResponseEmitter,
    null,
    true,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
};

const processCallbackShareResponseCredentials = async () => {
  // Se ejecutan de a 5
  const shareResponses = await ShareResponse.find({
    process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_CREDENTIALS,
    errorMessage: {
      $exists: false,
    },
  })
    .sort({ createdOn: -1 })
    .limit(5);
  // eslint-disable-next-line no-console
  for (const shareResponse of shareResponses) {
    try {
      await shareResponse.edit({ process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_EMITTER });
    } catch (error) {
      await shareResponse.edit({ errorMessage: 'Error' });
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

const callbackShareResponseCredentialsJob = (frequency) => {
  new CronJob(
    frequency,
    processCallbackShareResponseCredentials,
    null,
    true,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
};

const processCallbackShareResponseRecived = async () => {
  // Se ejecutan de a 5
  const shareResponses = await ShareResponse.find({
    process_status: SHARERESPONSE_PROCESS_STATUS.RECEIVED,
    errorMessage: {
      $exists: false,
    },
  })
    .sort({ createdOn: -1 })
    .limit(5);
  for (const shareResponse of shareResponses) {
    try {
      await shareResponse.edit({
        process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_CREDENTIALS,
      });
    } catch (error) {
      await shareResponse.edit({ errorMessage: 'Error' });
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

const callbackShareResponseRecivedJob = (frequency) => {
  new CronJob(
    frequency,
    processCallbackShareResponseRecived,
    null,
    true,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
};

exports.permanentJob = () => {
  const frequency = [
    SECONDS,
    MINUTES,
    HOURS,
    DAY_OF_MONTH,
    MONTH,
    DAY_OF_WEEK,
  ].join(' ');

  callbackShareResponseRecivedJob(frequency);
  callbackShareResponseCredentialsJob(frequency);
  callbackShareResponseEmitterJob(frequency);
};
