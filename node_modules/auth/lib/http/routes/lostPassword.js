var vine = require("vine"),
reqOutcome = require("./reqOutcome"),
step = require("step"),
dust = require("dustjs-linkedin"),
fs = require("fs");

exports.plugin = function(Account, LostPassword, httpServer, emailer, getToken, loader) {

	if(!emailer) return;

	//register the dust tpl ~ fugly >.>
	eval(dust.compile(fs.readFileSync(loader.params("http.lostPasswordEmailTpl"), "utf8"), "lostPasswordEmailTpl"));


	httpServer.get("/lost_password", function(req, res) {
		res.render("lost_password");
	});

	httpServer.post("/lost_password", function(req, res) {
		var on = reqOutcome(req, res, "lost_password");

		step(
			function() {
				Account.findOne({ email: req.body.email }, this);
			},
			on.success(function(account) {
				if(!account) return on(new Error("account does not exist"));
				this.account = account;

				var lostPassword = new LostPassword({ account: account._id });

				lostPassword.save(this);
			}),
			on.success(function(lostPassword) {
				var next = this;

				dust.render("lostPasswordEmailTpl", { email: req.body.email, token: lostPassword._id }, this);

			}),
			on.success(function(tpl) {
				var next = this;
				emailer.send({
					to: this.account.email,
					subject: "Reset Password",
					htmlBody: tpl
				}, function(err) {
					if(err) return on(new Error("Unable to send password recovery email"));
					next();
				})
			}),
			on.success(function() {
				res.render("lost_password_sent", {
					email: this.account.email
				});
			})
		);
	});

	function lostPasswordExists(req, res, next) {
		var on = reqOutcome(req, res, "lost_password");

		step(
			function() {
				LostPassword.findOne({ _id: req.query.token || req.body.token }, this);
			},
			on.success(function(lostPassword) {
				if(!lostPassword) {
					return on(new Error("The reset password token does not exist."));
				} else 
				if(lostPassword.expiresAt.getTime() < Date.now()) {
					lostPassword.remove();
					return on(new Error("The reset password link has expired."));
				}

				req.lostPassword = lostPassword;
				this();
			}),
			next
		);
	}

	httpServer.get("/reset_password", lostPasswordExists, function(req, res) {
		res.render("reset_password", {
			token: req.query.token
		});
	});

	httpServer.post("/reset_password", lostPasswordExists, function(req, res) {
		var on = reqOutcome(req, res, "reset_password");

		step(
			function() {
				if(req.body.password.length < 6) {
					console.log(vine.error(new Error("password must be at least 6 characters")).data)

					return on(new Error("password must be at least 6 characters"));
				}

				if(req.body.password != req.body.password2) {
					return on(new Error("passwords don't match"));
				}

				this();
			},
			function() {
				Account.findOne({ _id: req.lostPassword.account }, this);
			},
			on.success(function(account) {
				if(!account) return on(new Error("account doesn't exist"));
				account.password = req.body.password;
				account.save(this);
			}),
			on.success(function(account) {

				getToken(req, res, account, "reset_password");
				// res.render("login", vine.message("Please re-login with your new password").data);
				// req.lostPassword.remove();
			})
		);
	});
}