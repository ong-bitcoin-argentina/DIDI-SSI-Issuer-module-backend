const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const Constants = require("./constants/Constants");
const Messages = require("./constants/Messages");

const UserRoutes = require("./routes/UserRoutes");
const CertTemplateRoutes = require("./routes/CertTemplateRoutes");

const app = express();

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
		console.log();
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
if (Constants.DEBUGG) {
	console.log("route: " + route);
}

app.use(route + "/user", UserRoutes);
app.use(route + "/template", CertTemplateRoutes);

app.listen(Constants.PORT, function() {
	console.log(Messages.INDEX.MSG.RUNNING_ON + Constants.PORT);
});
