const spawn = require("child_process").spawn;

var env = Object.create(process.env);

// global
env.DEBUGG_MODE = "true";
env.ADDRESS = "http://192.168.2.103";
env.PORT = "3500";

env.HASH_SALT = "$2b$11$ggDdDiXNBkuEiQWTdHQ.hu";
env.RSA_PRIVATE_KEY =
	"-----BEGIN RSA PRIVATE KEY-----\n" +
	"MIIBOwIBAAJBAO64JHU8uFH4ZsmhbkGUFysU/GktjV3vT84TfGjKIjw6npCbFMeN\n" +
	"QZmmSa+TQb+oYurlO2YOaw5GI4LfQbkjnpcCAwEAAQJACEWrRcC/5l9EOJJ2fqFC\n" +
	"GEUW5hIlBu9HBa4ZLoxqmUmhmPhov5if2ga1IE9vpcTOzmGIMW/LPBGS184wW6tG\n" +
	"IQIhAPfwR5vkrSYkDudw6Sp5uwsTv1t2sMT3bWwhDJDquv1RAiEA9nsgNrc1Y95c\n" +
	"+YVHr6e4v4bZYcxsHV5WE8ZCC5EDw2cCIQCmPZ9l8W//UNIFcHmGF1TIWpdFllFz\n" +
	"34qoo4gvapOx4QIhAIdVc4qXbak4HrSiiYnY/Yer8w/Pvk0hzwFsijbvmLFhAiBB\n" +
	"JoZfex8gJUKiNfKXYtJkBFy2fTOQ7c1iEDS6hnIKSA==\n" +
	"-----END RSA PRIVATE KEY-----";

// api
env.DIDI_API = "http://192.168.2.103:3000/api/1.0/didi";

// ethr
env.BLOCK_CHAIN_URL = "https://did.testnet.rsk.co:4444";
env.BLOCK_CHAIN_CONTRACT = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";
env.BLOCK_CHAIN_DELEGATE_DURATION = "1300000";
env.BLOCK_CHAIN_SET_ATTRIBUTE = "999999999";

// mongo
env.MONGO_DIR = "127.0.0.1";
env.MONGO_PORT = "27017";
env.MONGO_DB = "didi_issuer";

/*
env.ISSUER_SERVER_DID = "0x36Fdb5032d8e42b8cd14C70A9c7Aef4a6086D8a3";
env.ISSUER_SERVER_PRIVATE_KEY = "3BD02F7EA67335A0E0455E821419A75B4B234FE2263FEFA2131A0E94B845050E";
*/

//env.ISSUER_DELEGATOR_DID = "0x36Fdb5032d8e42b8cd14C70A9c7Aef4a6086D8a3";
env.ISSUER_SERVER_DID = "0x688Fb7909536C1Cd3c4977726592580EaA48ACE3";
env.ISSUER_SERVER_PRIVATE_KEY = "9911908731448470418e8698ecb17dc0d793eb5f5568cf5403a4b30dbeea1752";

const run = spawn("nodemon", ["server.js"], { env: env });

run.stdout.on("data", function(data) {
	console.log(data.toString());
});

run.stderr.on("data", function(data) {
	console.log("stderr: " + data.toString());
});

run.on("exit", function(code) {
	console.log("child process exited with code " + code.toString());
});
