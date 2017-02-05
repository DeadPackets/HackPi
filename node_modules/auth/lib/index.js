var structr = require("structr"),
ownableModel = require("./mixin/ownableModel"),
Account = require("./models/account"),
LostPassword = require("./models/lostPassword"),
_ = require("underscore"),
middleware = require("./http/middleware");


var Auth = structr({

	/**
	 */

	publicKeys: ["login", "signup"],

	/**
	 */

	"__construct": function(options) {
		this.connection = options.connection;
		this.Account    = Account.model(options);
		this.LostPassword = LostPassword.model(options.connection);
		this.middleware = middleware.plugin(this);
		this.ownable = function(schema) {
			return ownableModel(schema, options.connection);
		}
	},

	/**
	 * logs the user in
	 */

	"login": function(credentials, callback) {
		this.Account.login.apply(this.Account, arguments);
	},

	/**
	 * signs a user up
	 */

	"signup": function() {
		this.Account.signup.apply(this.Account, arguments);
	}
});

exports.access  = require("./access");

exports.connect = function(options) {
	return new Auth(options);
}


exports.require = [["auth.middleware.*"], "emailer", "plugin-mongodb", "plugin-express"];
exports.plugin = function(authMiddleware, emailer, mongodb, httpServer, loader) {


	var auth = exports.connect(_.extend({
		connection: mongodb
	}, loader.params("auth")));


	require("./http/routes").plugin(httpServer, emailer, auth, loader);

	return auth;
}
