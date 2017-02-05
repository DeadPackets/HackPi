var _        = require("underscore"),
access       = require("../access"),
comerr       = require("comerr");





module.exports = function(schema, connection) {

	var Schema = connection.base.Schema,
	ObjectId   = Schema.ObjectId;

	var Owner = new Schema({
		account: ObjectId,
		access: [ String ]
	});

	var Account = connection.model("accounts").schema,
	collectionName;

	//add owners schema to the item
	schema.add({
		owners: [ Owner ],

		//is the item visible to the public?
		isPublic: { type: Boolean, default: false }
	});

	//add a method to all
	schema.methods.fetchOwner = function(callback) {
		var owner = _.find(this.owners, function(owner) {
			return ~owner.access.indexOf(access.SUPER);
		});
		if(!owner) return callback(new Error("item doesn't have an owner"));
		this.model("accounts").findOne({ _id: owner.account }, function(err, account) {
			if(err) return callback(err);
			if(!account) return callback(new comerr.NotFound("account does't exist"));
			callback(err, account);
		});
	}


	//plucks any access to shared 
	schema.statics.revokeShared = function(account, callback) {
		this.collection.update(account.ownQuery(), {$pull:{ owners:{ account: account._id }}}, { multi: true }, callback);
	}

	//model is needed to remove the item if the account is deleted.
	//NOTE - database might not be present, so we just grab the name for reference 
	//later on
	schema.once("init", function(m) {
		collectionName = m.collection.name;
	});

	//on remove, remove the item as well.
	Account.pre("remove", function(next) {
		if(!collectionName) {
			console.warn("model is not provided with an ownable schema");
			return next();
		}

		var model = this.model(collectionName), 
		self = this;

		//first remove ALL items that belong to this acocunt
		model.collection.remove(this.ownQuery(access.SUPER), { multi: true }, function() {

			//next, pluck ANY items that maybe associated with this account
			model.revokeShared(self, function(){});
		});
		next();
	});

	schema.pre("save", function(next) {
		if(!this._account) {
			return next();
		}

		if(this.authorized([this.isNew ? access.POST : access.PUT])) {
			next();
		} else {
			this._account.unauthorized(next);
		}
	});	

	schema.methods.authorized = function(acc, callback) {

		if(typeof access == "function") {
			callback = null;
			acc      = null;
		}

		if(!acc) {
			acc = access.all();
		}

		var authorized = !this._account || this._account.authorized(this, acc);

		return !callback ? authorized : callback(null, authorized);
	}

	var oldToJson = schema.methods.toJSON;

	//lockdown serialization
	schema.methods.toJSON = function() {

		//locked down?
		if(this.authorized([access.GET])) {
			return this.toObject();
		} else {
			return { error: this._account.unauthorized().message };
		}
	}


	return schema;
}