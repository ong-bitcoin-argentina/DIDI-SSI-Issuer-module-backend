const spawn = require("child_process").spawn;

var env = Object.create(process.env);

env.REACT_APP_API_URL= "http://localhost:3500/api/1.0/didi_issuer";
env.PORT = "3502";

const run = spawn("react-scripts", ["start"], { env: env });

run.stdout.on("data", function(data) {
	console.log(data.toString());
});

run.stderr.on("data", function(data) {
	console.log("stderr: " + data.toString());
});

run.on("exit", function(code) {
	console.log("child process exited with code " + code.toString());
});
