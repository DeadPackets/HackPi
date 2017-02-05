var access = require("../access"),
crypto     = require("crypto"),
_          = require("underscore"),
access     = require("../access"),
Token      = require("./token"),
outcome    = require("outcome"),
step       = require("step"),
dsync      = require("dsync"),
structr    = require("structr"),
outcome = require("outcome"),
comerr = require("comerr"),
verify = require("verify")();

exports.model = function(options) {

	var database = options.connection;

	Token.model(database);

	var Schema = database.base.Schema,
	ObjectId = Schema.Types.ObjectId;


	verify.register("password", "Invalid password. Must be at least 6 chars.").len(6);

	/**
	 */

	var Account = new Schema({

		/**
		 */

		validated: { type: Boolean, default: false },

		/**
		 */

		validatedAt: { type: Date, default: Date.now },

		/**
		 */

		validationKey: { type: String, default: function() {
			return Date.now() + "_" + Math.round(Math.random()*44332482393);
		}},

		/**
		 */

		password: { type: String, required: true, set: hashPass, select: false, default: randomPass },

		/**
		 */

		createdAt: { type: Date, default: Date.now }
	});

	Account.publicMethods = ["getMainToken", "createToken"];

	Account.plugin(dsync.schema);
	Account.add(options.fields || {});

	var authFields;

	if(!(authFields = options.authFields)) {
		Account.add({ email: { type: String, required: true, index: { unique: true }} });
		authFields = ["email", "password"];
	}


	/**
	 * makes this account the owner of the target item. NOT used
	 * for querying since mongodb cannot do deep object searching 
	 */

	Account.methods.ownItem = function(item, acc) {
		if(!item.owners) item.owners = [];
		var self = this;

		if(!acc) {
			acc = access.all(false);
		}

		if(!(acc instanceof Array)) {
			acc = [acc];
		}


		if(!item.owners.length) {
			acc.push(access.SUPER); //owner
		}

		if(this.isItemOwner(item)) return;

		item.owners.push({
			account: self._id,
			access: acc
		});
	}

	/**
	 */

	Account.methods.shareItem = Account.methods.ownItem;

	/**
	 */

	Account.methods.disownItem = function(item) {
		console.log(item.owners.remove);
	}

	/**
	 */

	Account.methods.lockdownItem = function(item) {
		item._account = this;
	}

	/**
	 * returns true / false if authorized for the given action
	 */

	Account.methods.authorized = function(item, access) {

		//MUST 
		return this.isItemOwner(item, access) && (this.token ? this.token.authorized(item, access) : true);
	}

	/**
	 * dead simple flow-control function. Use it like this:
	 * if(!user.hasItemAccess(item)) return user.unauthorized(callback);
	 */

	Account.methods.unauthorized = function(callback) {

		var err = new comerr.Unauthorized();

		return arguments.length ? callback(err) : err;
	}

 
	/**
	 * returns true 
	 */

	Account.methods.isItemOwner = function(item, acc) {

		if(!acc) acc = access.all(true);
		if(!(acc instanceof Array)) acc = [acc];

		var self = this;
		//first check if the owner exists. If
		return !!_.find(item.owners, function(owner) {
			return String(owner.account) == String(self._id) && 
			!!_.intersection(acc, owner.access).length;
		});
	}


	/**
	 * wraps owner tags around a query
	 */

	Account.methods.addToSearch = function(query, access) {

		if(arguments.length === 1 && ((typeof query === "string") || (query instanceof Array))) {
			access = query;
			query  = {};
		}

		if(!query) query = {};

		var oaccount,
		oaccess,
		search = {
			"owners.account": this._id,
		}

		//do?
		/*if(!access) {
			access = "SUPER";
		}*/

		//TODO - make 
		if(access) {
			search["owners.access"] = access;
		}

		return _.extend(query, search);
	}

	/**
	 * returns the main account token
	 */

	Account.methods.getMainToken = function(callback) {
		this.model("tokens").getMainToken(this, callback);
	}

	/**
	 */

	Account.methods.createToken = function(options, callback) {
		this.model("tokens").createToken(this, options, callback);
	}

	/**
	 */

	Account.statics.signup = function(acc, callback) {
		var Account = this;

		if(!verify.check(acc).onError(callback).has("email", "password").success) return;

		var on = outcome.error(callback);

		//email must be lower case - it generally is. What if they're signing up on an apple device?
		acc.email = acc.email.toLowerCase();
		
		step(
			function() {
				Account.findOne({ email: acc.email }, this);
			},
			on.success(function(account) {
				if(account) return callback(new comerr.AlreadyExists("That account name is already taken."));
				new Account(acc).save(this);
			}),
			on.success(function(account) {
				callback(null, account);
				Account.emit("signup", account);
			})
		);
	}

	/**
	 */

	Account.statics.login = function(credentials, callback) {

		var Token = this.model("tokens");

		if(!callback) callback = function(){};
		if(credentials.token) {
			return Token.login(credentials, callback);
		} else {

			var q = {};


			authFields.forEach(function(fieldName) {
				q[fieldName] = fieldName == "password" ? hashPass(String(credentials.password)) : credentials[fieldName];
				if(fieldName == "email") q[fieldName] = String(credentials[fieldName]).toLowerCase();
			});


			this.findOne(q, outcome.error(callback).success(function(account) {
				if(!account) return callback(new comerr.IncorrectInput("Incorrect email / password"));
				callback(null, account);
			}));
		}
	}

	/**
	 */

	function hashPass(pass) {
		return crypto.createHash("sha1").update(pass).digest("hex");
	}

	/**
	 */

	function randomPass() {
		return hashPass(Date.now() + "_" + Math.round(Math.random() * 99999))
	}

	return database.model("accounts", Account);
}

