var plugin = require("plugin");


plugin().
params({
	http: {
		port: 8085
	},
	mongodb: "mongodb://localhost/auth-tes"
}).
require("plugin-express").
require("plugin-mongodb").
require(__dirname + "/../").
load();