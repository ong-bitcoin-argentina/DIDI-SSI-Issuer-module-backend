const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const Constants = require("./constants/Constants");
const Messages = require("./constants/Messages");

const UserRoutes = require("./routes/UserRoutes");
const TemplateRoutes = require("./routes/TemplateRoutes");
const CertRoutes = require("./routes/CertRoutes");
const ParticipantRoutes = require("./routes/ParticipantRoutes");

const log = console.log;
console.log = function(data) {
	process.stdout.write(new Date().toISOString() + ": ");
	log(data);
};

// set up node module clusters - one worker per CPU available
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;

const app = express();
var http = require("http");
var server = http.createServer(app);

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());

if (Constants.DEBUGG) console.log(Messages.INDEX.MSG.CONNECTING + Constants.MONGO_URL);

mongoose
	.connect(Constants.MONGO_URL, {
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.then(() => console.log(Messages.INDEX.MSG.CONNECTED))
	.catch(err => {
		console.log(Messages.INDEX.ERR.CONNECTION + err.message);
	});

app.get("/", (_, res) => res.send(Messages.INDEX.MSG.HELLO_WORLD));

// log calls
app.use(function(req, _, next) {
	if (Constants.DEBUGG) {
		console.log(req.method + " " + req.originalUrl);
		process.stdout.write("body: ");
		console.log(req.body);
	}
	next();
});

app.use(cors());

// log errors
app.use(function(error, _, _, next) {
	console.log(error);
	next();
});

const route = "/api/" + Constants.API_VERSION + "/didi_issuer";
if (Constants.DEBUGG) console.log("route: " + route);

app.use(route + "/user", UserRoutes);
app.use(route + "/participant", ParticipantRoutes);
app.use(route + "/template", TemplateRoutes);
app.use(route + "/cert", CertRoutes);

if (cluster.isMaster) {
	console.log(Messages.INDEX.MSG.STARTING_WORKERS(numCPUs));

	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("online", function(worker) {
		console.log(Messages.INDEX.MSG.STARTED_WORKER(worker.process.pid));
	});

	cluster.on("exit", function(worker, code, signal) {
		console.log(Messages.INDEX.MSG.ENDED_WORKER(worker.process.pid, code, signal));
		console.log(Messages.INDEX.MSG.STARTING_WORKER);
		cluster.fork();
	});
} else {
	server.listen(Constants.PORT);
	console.log(Messages.INDEX.MSG.RUNNING_ON + Constants.PORT);
}
