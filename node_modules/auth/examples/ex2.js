var step = require("step"),
mongoose = require("mongoose");

require("./models");

var auth = require("../").connect({
	connection: mongoose.createConnection("mongodb://localhost/auth-test")
});

var user1, user2, post, Post = auth.connection.model("posts");


step(
	function() {
		console.log("u1");
		auth.signup({ email: "me@email.com", password: "password" }, this);
	},
	function(err, u1) {
		user1 = u1;
		console.log("u2");
		auth.signup({ email: "me@email2.com", password: "password" }, this);
	},
	function(err, u2) {
		user2 = u2;
		if(err) consoe.log(err.stack)
		post = new Post({title:"test", message:"hello"});
		user1.ownItem(post);
		post.save(this);
	},
	function(err) {
		if(err) consoe.log(err.stack)
		Post.findOne(user1.addToSearch(), this);

	},
	function(err, p) {
		post = p;

		if(!user1.hasItemAccess(p)) return user1.unauthorized(this);

		user2.lockdownItem(p);
		console.log(JSON.stringify(p))

		//share with my friend
		user2.shareItem(p);
		p.save(this);
	},
	function(err) {
		console.log(err)
		post.fetchOwner(this);
	},
	function(err, u) {
		console.log(err);
		user1 = u;
		this();
	},
	function(err) {
		console.log(err);
		user1.remove();
		user2.remove();
	}
)

