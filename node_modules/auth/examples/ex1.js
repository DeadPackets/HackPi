var mongoose = require("mongoose"),
step = require("step"),
outcome = require("outcome");

var auth = require("../").init({
	connection: mongoose.connect("mongodb://localhost:27017/auth")
});


auth.connection.model("friends", new mongoose.Schema({
	name: String,
	last: String
}))


auth.sharedCollections.add("friends");


var on = outcome.error(function(err) {
	console.error(err.stack);
}),
user,
user2;





step(

	/**
	 */

	function() {
		auth.signup({ username: "craig", email: "craig.j.condon@gmail.com", password: "test" }, this);
	},

	/**
	 */

	on.success(function(data) {
		user = data.user;
		auth.signup({ username: "john", email: "craig.j.condon+test@gmail.com", password: "test"}, this);
	}),

	/**
	 */

	on.success(function(data) {
		user2 = data.user;

		//thrown into a job
		user.grantPermission(user2, ["*:friends"]);

		//wait for permissions to be granted
		auth.worker.once("grant", this);
	}),

	/**
	 */

	on.success(function() {
		auth.sandbox("*:friends").login({ username: "john", password: "test" }, this);
	}),

	/**
	 */

	on.success(function(data) {
		console.log(data.token.scopes);
	})
);