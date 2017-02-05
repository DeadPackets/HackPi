var vine = require("vine"),
comerr = require("comerr");

exports.plugin = function(auth) {

	var Account = auth.Account;

	return {
		authCheckpoint: function(req, res, next) {
			if(req.session.token) {
				q = { token: req.session.token };
			} else {
				q = req.query.token || req.query.email ? req.query : req.body || req.query;
			}

			Account.login(q, function(err, account) {

				if(err) {

					if(/\.json$/.test(req.path)) return res.send(vine.error(new comerr.Unauthorized("you must be logged in to view this page")));
					
					return res.redirect("/login?redirect_to=" +  encodeURIComponent(req.originalUrl));
					// return res.send(vine.error(err));
				}
				req.account = account;
				next();
			});
		},
		
	}
}