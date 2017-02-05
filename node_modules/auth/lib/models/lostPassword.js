exports.model = function(con) {
	var Schema = con.base.Schema,
	ObjectId = Schema.Types.ObjectId;


	var LostPasswordSchema = new Schema({

		/**
		 */

		"createdAt": { type: Date, default: Date.now },

		/**
		 * 10 minutes
		 */

		"expiresAt": { type: Date, default: Date.now() + 1000 * 60 * 60 },

		/**
		 * account this associated with
		 */

		"account": ObjectId
	});	


	return con.model("lostPassword", LostPasswordSchema);
}