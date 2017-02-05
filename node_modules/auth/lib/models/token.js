
/**
 * tokens are especially useful when turning on / off features
 * of an account. They're used for items such as bookmarklets, and perhaps
 * public tokens which modifies the user's account. 
 */

var step     = require("step"),
outcome      = require("outcome"),
access       = require("../access"),
_            = require("underscore"),
dsync        = require("dsync"),
comerr       = require("comerr");

exports.model = function(database) {

	var Schema = database.base.Schema,
	ObjectId   = Schema.Types.ObjectId;

	var Scope = new Schema({

		/**
		 * the specific 
		 */

		item: ObjectId,

		/**
		 * col - collection is reserved
		 */

		collectionName: String,

		/**
		 * access level, read, write, read+write
		 */

		access: [String]
	});

	var Token = new Schema({

		/**
		 * granter of this token
		 */

		
		account: { type: ObjectId, required: true },

		/**
		 */

		createdAt: { type: Date, default: Date.now },

		/**
		 * public key used to login. This can be refreshed.
		 */

		key: { type: String, default: generateKey },

		/**
		 * when does the token expire?
		 */

		expiresAt: Date,

		/**
		 */

		scopes: { type: [ Scope ], select: false },

		/**
		 * time in seconds to keep token alive for. -1 = forever
		 */

		ttl: { type: Number, default: -1, select: false },

		/**
		 */

		main: { type: Boolean, select: false }

	});

	Token.publicKeys = ["account", "createdAt", "expiresAt", "key"];
	Token.plugin(dsync.schema);

	/**
	 */

	Token.statics.getMainToken = function(account, callback) {


		var self = this, Token = this, on = outcome.error(callback);
		step(

			/**
			 */
			 
			function() {
				self.findOne({ account: account._id, main: true }, this);
			},

			/**
			 */
			 
			on.success(function(token) {
				var next = this;
				if(!token) {
					token = new Token({
						main: true,
						account: account._id,
						scopes:[{
							collectionName: null, //ALL
							item: null, //ALL
							access: access.all(true)
						}]
					});

					return token.save(function() {
						next(null, token);
					});
				}
				account.token = token;
				next(null, token);
			}),
			
			/**
			 */
			 
			callback
		);
	}

	/**
	 * login with a token
	 */

	Token.statics.login = function(options, callback) {
		var token = options.token,
		Account = this.model("accounts"),
		Token = this,
		on = outcome.error(callback);

		var t, a;

		step(

			/**
			 */

			function() {
				Token.findOne({ key: token }, this);
			},

			/**
			 */
			 
			on.success(function(token) {

				//404
				if(!token) return callback(new comerr.NotFound("token does not exist", { type: "token" }));

				//expired - TODO - add in query: {$or:[{expiresAt:null},{expiresAt:{$lt:new Date()}}]}
				if(token.expiresAt && token.expiresAt.getTime() < Date.now().getTime()) {
					token.remove();
					return callback(new comerr.Expired("token has expired"));
				}

				//find the user
				t = token;
				Account.findOne({ _id: token.account }, this);
			}),

			/**
			 */
			 
			on.success(function(account) {
				
				//this shouldn't happen
				if(!account) return callback(new comerr.NotFound("account does not exist", { type: "account" }));

				a = account;
				//attach the token so the account can restrict some access to features
				account.token = t;

				this(null, account);
			}),

			/**
			 */
			 
			callback
		);
	}

	/**
	 */

	Token.statics.createToken = function(account, options, callback) {

		if(arguments.length === 2) {
			callback = options;
			options  = {};
		}

		var item, collectionName, acc = options.access || access.all(false);

		if(options.item) {
			if(options.item._id) {
				item = options.item._id;
				collectionName = options.item.collection.name;
			}
		}

		var self = this, Token = this, on = outcome.error(callback);
		step(

			/**
			 */
			 
			function() {
				token = new Token({
					account: account._id,
					ttl: options.ttl || -1,
					scopes: [{
						item: item,
						collectionName: collectionName,
						access: acc
					}]
				});
				account.token = token;
				token.save(this);
			},

			/**
			 */
			 
			callback
		)
	}

	/**
	 */

	Token.methods.authorized = function(item, acc) {

		if(!acc) acc = [access.SUPER];

		var collectionName = item.collection.name,
		itemId             = String(item._id),
		acc2               = acc instanceof Array ? acc : [acc];

		return !!_.find(item.scopes, function(scope) {

			//no collection (all), OR the collection matches
			return (!!scope.collectionName || (scope.collectionName === collectionName)) &&

			//AND no item, OR the item matches the scoped item
			(!!scope.item || (String(scope.item) === itemId)) &&

			//AND the scope access intersects. This must intersect. 
			!!_intersection(scope.access, acc2).length;
		})
	}

	/** 
	 * regenerates the key used to login
	 */

	Token.methods.regenerateKey = function() {
		this.key = generateKey();
	}

	/**
	 * make sure the grantee is set
	 */

	Token.pre("save", function(next) {
		if(~this.ttl && !this.expiresAt) {
			this.expiresAt = Date.now() + this.ttl; 
		}
		next();
	});

	/**
	 */

	function generateKey() {
		return Date.now() + "_" + Math.round(Math.random() * 999999999999999);
	}

	/**
	 */

	return database.model("tokens", Token);
}

