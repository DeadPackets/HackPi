var auth = require("auth").init({
	collections: {
		profile: "profile",
		sessions: "session",
		friends: "friends"
	},
	connection: dbconnection
});

	

auth.collections.register("friends");



var profile = auth.signup()



