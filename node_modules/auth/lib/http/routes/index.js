var step = require("step"),
vine = require("vine"),
reqOutcome = require("./reqOutcome"),
dust = require("dustjs-linkedin"),
step = require("step"),
fs = require("fs");

exports.plugin = function(httpServer, emailer, auth, loader) {

	var Account = auth.Account,
	InvitedAccount = auth.InvitedAccount,
	privateMode = loader.params("privateMode") || false,
	domain = loader.params("domain"),
	serviceName = loader.params("serviceName");

	eval(dust.compile(fs.readFileSync(loader.params("http.validateEmailTpl"), "utf8"), "validateEmailTpl"));


	function getToken(req, res, account, render, redirect) {
		account.getMainToken(function(err, token) {

			req.session.token = token.key;

			if(!render) {
				if(err) {
					return res.send(vine.error(err));
				} else {
					var obj = account.toObject();
					delete obj.password; //why is this still here??
					obj.token = token;
					res.send(vine.result(obj));
				}
				return;
			}

			if(err) return res.render(render, {
				error: err.message
			});


			res.redirect(redirect || req.query.redirect_to || loader.params("http.loginRedirect") || "/");
		});
	}

	httpServer.get("/account.json", auth.middleware.authCheckpoint, function(req, res) {
		getToken(req, res, req.account);
	});

	httpServer.post("/account.json", function(req, res) {
		Account.signup(req.body, function(err, account) {
			if(err) return res.send(vine.error(err));
			getToken(req, res, account);
		})
	})


	httpServer.get("/login", function(req, res) {

		if(!req.secure && req.headers["x-forwarded-proto"] != "https" && !/127.0.0.1|localhost/.test(String(req.headers.host)))  {
			return res.redirect("https://" + (req.headers.host || loader.params("domain") || loader.params("http.host")) + req.url);
		}

		res.render("login", {
			redirect_to: req.query.redirect_to
		});
	});

	httpServer.get("/logout", function(req, res) {
		delete req.session.token;
		res.redirect("/login");
	});

	httpServer.post("/login", function(req, res) {
		Account.login(req.body, reqOutcome(req, res, "login").success(function(acc) {
			getToken(req, res, acc, "login");
		}));
	});

	httpServer.get("/signup", function(req, res) {
		res.render("signup");
	});


	httpServer.get("/validate_account", function(req, res) {
		var on = reqOutcome(req, res, "validate_account");

		step(
			function() {
				Account.findOne({ _id: req.query.account }, this);
			},
			on.success(function(account) {
				if(!account) return on(new Error("account does not exist"));
				// if(account.validated) return on(new Error("this account has already been validated"));
			
				if(account.validationKey != req.query.validationKey) return on(new Error("incorrect validation key"));
				account.validatedAt = new Date();
				account.validated = true;
				account.save(this);
				Account.emit("validated", account);
			}),
			on.success(function(account) {
				res.render("validate_account", {
					account: account
				});
			})
		);
	});

	Account.on("signup", function(acc) {
		step(
			function() {
				dust.render("validateEmailTpl", { validationKey: acc.validationKey, accountId: acc._id }, this);
			},
			function(err, tpl) {
				if(err) return console.error(err);
				var next = this;
				console.log("sending validation email");
				emailer.send({
					to: acc.email,
					subject: "Validate Account",
					htmlBody: tpl
				}, function(err) {
					if(err) console.error(err)
					next();
				});

			},
			function() {

			}
		);
	});


	httpServer.post("/signup", function(req, res) {

		console.log("signing up")
		var on = reqOutcome(req, res, "signup");

		/*if(privateMode && !req.body.referredBy) {
			on(new Error("You cannot signup unless you've been invited by someone"));
		}*/

		Account.signup(req.body, reqOutcome(req, res, "signup").success(function(acc) {
			getToken(req, res, acc, "signup", loader.params("http.signupRedirect"));
		}));
		
	});


	require("./lostPassword").plugin(Account, auth.LostPassword, httpServer, emailer, getToken, loader);
}