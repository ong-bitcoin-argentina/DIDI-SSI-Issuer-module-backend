const { LoggerManager, AzureLogger } = require('@proyecto-didi/didi-ssi-logger');

const loggerManager = new LoggerManager();
const azureLogger = new AzureLogger({
  aiCloudRole: process.env.NAME,
  aiCloudRoleInstance: process.env.ENVIRONMENT,
  disableAppInsights: process.env.DISABLE_TELEMETRY_CLIENT,
  environment: process.env.ENVIRONMENT,
  ikey: process.env.APP_INSIGTHS_IKEY,
});

loggerManager.addLogger('azure', azureLogger);

module.exports = {
  loggerManager,
};
