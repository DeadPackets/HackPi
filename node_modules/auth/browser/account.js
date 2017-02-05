var structr = require("structr"),
_ = require("underscore");

exports.connect = function(host) {

	var host = window.location.protocol + "//" + window.location.host;

	if(window.location.port && String(window.location.port).length > 0) {
		host += ":" + window.location.port;
	}



	var Account;
	return Account = structr({

		/**
		 */

		"__construct": function(data) {
			_.extend(this, data);
		},

		/**
		 */

		"save": function() {
			//TODO
		},

		/**
		 */

		"static login": function(data, onLogin) {

			if(arguments.length == 1) {
				onLogin = data;
				data = {};
			}

			$.ajax({
				type: "GET",
				data: data,
				url: host + "/account.json",
				success: function(resp) {
					if(resp.errors) return onLogin(resp.errors);
					onLogin(null, new Account(resp.result));
				}
			})
		},


		/**
		 */

		"static signup": function(data, onSignup) {
			$.ajax({
				type: "POST",
				data: data,
				url: host + "/account.json",
				success: function(resp) {
					if(resp.errors) return onLogin(resp.errors);
					onLogin(null, new Account(resp.result));
				}
			})
		}
	});
}


