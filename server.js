/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv-flow').config({
  silent: true,
});
require('./services/logger');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const cors = require('cors');
const http = require('http');

// serve all files from public dir
const path = require('path');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Constants = require('./constants/Constants');
const Messages = require('./constants/Messages');

const UserRoutes = require('./routes/UserRoutes');
const TemplateRoutes = require('./routes/TemplateRoutes');
const CertRoutes = require('./routes/CertRoutes');
const ParticipantRoutes = require('./routes/ParticipantRoutes');
const DelegateRoutes = require('./routes/DelegateRoutes');
const RegisterRoutes = require('./routes/RegisterRoutes');
const DefaultRoutes = require('./routes/DefaultRoutes');
const ProfileRoutes = require('./routes/ProfileRoutes');
const ImageRoutes = require('./routes/ImageRoutes');

// inicializar cluster para workers, uno por cpu disponible

const app = express();

const server = http.createServer(app);

const dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// sobreescribir log para agregarle el timestamp
const { log } = console;
console.log = function (data) {
  process.stdout.write(`${new Date().toISOString()}: `);
  log(data);
};

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

if (Constants.DEBUGG) console.log(Messages.INDEX.MSG.CONNECTING + Constants.MONGO_URL);

// configuracion de mongoose
mongoose
  .connect(Constants.MONGO_URL)
  .then(() => console.log(Messages.INDEX.MSG.CONNECTED))
  .catch((err) => {
    console.log(Messages.INDEX.ERR.CONNECTION + err.message);
  });

/**
 * Config de Swagger
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: process.env.NAME,
      description: `Corriendo en el ambiente: ${process.env.ENVIRONMENT}. Para más información, visite la [documentación](https://docs.didi.org.ar/).`,
      version: process.env.VERSION,
    },
    servers: [{
      url: '/',
    }],
  },
  apis: ['./*.js', './routes/*.js'], // files containing annotations as above
};
const apiSpecification = swaggerJsdoc(options);
/**
 * @openapi
 * /api-docs:
 *   get:
 *     description: Welcome to the jungle!
 *     responses:
 *       200:
 *         description: Returns a mysterious webpage.
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpecification));

/**
 * @openapi
 * /:
 *   get:
 *     description: Bienvenido a DIDI Issuer Backend!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/', (_, res) => res.send(`${Messages.INDEX.MSG.HELLO_WORLD} v${process.env.VERSION}`));

// loggear llamadas
app.use((req, _, next) => {
  if (Constants.DEBUGG) {
    console.log(`${req.method} ${req.originalUrl}`);
    process.stdout.write('body: ');
    console.log(req.body);
  }
  next();
});

app.use(cors());

// loggear errores
app.use((error, req, _, next) => {
  console.log(error);
  next();
});

app.use(
  multer({
    dest: './uploads/',
    rename: function rename(_fieldname, filename) {
      return filename;
    },
  }).single('file'),
);

app.use('/user', UserRoutes);
app.use('/participant', ParticipantRoutes);
app.use('/template', TemplateRoutes);
app.use('/cert', CertRoutes);
app.use('/delegate', DelegateRoutes);
app.use('/register', RegisterRoutes);
app.use('/default', DefaultRoutes);
app.use('/profile', ProfileRoutes);
app.use('/image', ImageRoutes);

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
