vine = require("vine"),
outcome = require("outcome"),
_ = require("underscore");

module.exports = function(req, res, render) {
	var on = outcome.error(function(err) {
		res.render(render, _.extend(req.query, vine.error(err).data));
	});
	return on;
}