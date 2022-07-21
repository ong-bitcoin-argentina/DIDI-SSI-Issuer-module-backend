const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Messages = require('./constants/Messages');
const Constants = require('./constants/Constants');

const app = require('./server.js');

const server = http.createServer(app);

// forkear workers
if (cluster.isMaster) {
  console.log(Messages.INDEX.MSG.STARTING_WORKERS(numCPUs));

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(Messages.INDEX.MSG.STARTED_WORKER(worker.process.pid));
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(Messages.INDEX.MSG.ENDED_WORKER(worker.process.pid, code, signal));
    console.log(Messages.INDEX.MSG.STARTING_WORKER);
    cluster.fork();
  });
} else {
  server.listen(Constants.PORT);
  console.log(Messages.INDEX.MSG.RUNNING_ON + Constants.PORT);
}
