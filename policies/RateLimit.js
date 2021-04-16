const rateLimit = require("express-rate-limit");

const getMsByMinutes = minutesWanted => minutesWanted * 60 * 1000;

module.exports.halfHourLimiter = rateLimit({
	windowMs: getMsByMinutes(30),
	max: 15,
	message: "Too many intents created from this IP, please try again after 30 minutes"
});
