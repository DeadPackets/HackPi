var mongoose = require("mongoose"),
auth         = require("../"),
Schema       = mongoose.Schema;

exports.Comment = new Schema({
	message: String
});

exports.Post = new Schema({
	title: String,
	message: String,
	comments: [exports.Comment]
});


exports.Post.plugin(auth.ownable);
mongoose.model("posts", exports.Post);