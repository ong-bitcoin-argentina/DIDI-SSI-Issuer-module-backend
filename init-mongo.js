const MONGO_INITDB_DATABASE = "didi_issuer";
const MONGO_USERNAME = "didi_admin";
const MONGO_PASSWORD = "uIERvZXMiLCJpYXQiOjE1MTYyMzkwMjJ9";

db.createUser({
	user: "didi_admin",
	pwd: "uIERvZXMiLCJpYXQiOjE1MTYyMzkwMjJ9",
	roles: [
		{
			role: "readWrite",
			db: "didi"
		}
	]
});
