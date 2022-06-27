/* eslint-disable no-new */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const ShareResponseService = require('../services/ShareResponseService');
const ShareResponseModel = require('../models/ShareResponse');
const { SHARERESPONSE_PROCESS_STATUS } = require('../constants/Constants');

const SECONDS = '0';
const MINUTES = '*/2';
const HOURS = '*';
const DAY_OF_MONTH = '*';
const MONTH = '*';
const DAY_OF_WEEK = '*';

const processCallbackShareResponseEmitter = async () => {
  // Se ejecutan de a 5
  const shareResponses = await ShareResponseModel.find({
    process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_EMITTER,
    errorMessage: {
      $exists: false,
    },
  })
    .sort({ createdOn: -1 })
    .limit(5);
  // eslint-disable-next-line no-unused-vars
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
  const job = new CronJob(
    frequency,
    processCallbackShareResponseEmitter,
    null,
    false,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
  job.start();
};

const processCallbackShareResponseCredentials = async () => {
  // Se ejecutan de a 5
  const shareResponses = await ShareResponseModel.find({
    process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_CREDENTIALS,
    errorMessage: {
      $exists: false,
    },
  })
    .sort({ createdOn: -1 })
    .limit(5);
  for (const shareResponse of shareResponses) {
    try {
      await shareResponse.edit({
        process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_EMITTER,
      });
    } catch (error) {
      await shareResponse.edit({ errorMessage: 'Error' });
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

const callbackShareResponseCredentialsJob = (frequency) => {
  const job = new CronJob(
    frequency,
    processCallbackShareResponseCredentials,
    null,
    false,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
  job.start();
};

const processCallbackShareResponseRecived = async () => {
  // Se ejecutan de a 5
  const shareResponses = await ShareResponseModel.find({
    process_status: SHARERESPONSE_PROCESS_STATUS.RECEIVED,
    errorMessage: {
      $exists: false,
    },
  })
    .sort({ createdOn: -1 })
    .limit(5);
  for (const shareResponse of shareResponses) {
    try {
      await ShareResponseService.validateFormat(shareResponse);
      await ShareResponseService.validateCredentialClaims(shareResponse);
      await ShareResponseService.validateIssuer(shareResponse);

      await shareResponse.edit({
        process_status: SHARERESPONSE_PROCESS_STATUS.VERIFIED_CREDENTIALS,
      });
    } catch (error) {
      await shareResponse.edit({ errorMessage: error.message });
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

const callbackShareResponseRecivedJob = (frequency) => {
  const job = new CronJob(
    frequency,
    processCallbackShareResponseRecived,
    null,
    false,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
  job.start();
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
