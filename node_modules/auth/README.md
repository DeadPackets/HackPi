

## Features

- share items with multiple users
- creating account tokens with access to specific collections & items
	- used for locking down public access to certain features.
	- ability to add expiration for tokens
- 

```javascript

var mongoose = require("mongoose"),
step         = require("step"),
Schema       = mongoose.Schema,
ObjectId     = Schema.Types.ObjectId;


var auth = require("auth").connect({
	connection: mongoose.createConnection("mongodb://localhost/auth-test")
});

var Post = new Schema({
	message: String
});
	
//make the post ownable
Post.plugin(auth.ownable);

step(
	function() {
		auth.signup({ email: "me@email.com", password: "password" }, this);
	},
	function(err, account) {
		this.account = account;
		var post = new Post({
			message: "Hello World!"
		});

		//make the account OWN the post
		account.own(post);

		post.save(this);
	},
	function() {
		Post.find(this.account.ownQuery(), this);
	},
	function(err, post) {
		console.log(post.message); //Hello World!
	}
);
```


## auth API

### auth auth.connect(options)
	
- options
	`connection` - mongodb connection

### auth.Account.signup(account, onCreated)

creates a new user

### auth.Account.login(credentals, onLogin)

Logs the user in with u/p, or a token

Example:

```javascript
auth.Account.login({ token: tokenKey }, onLogin);
auth.Account.login({ email: "email", password: "password" }, onLogin);
```

## Account API

### account.getMainToken(callback)

returns the main access token with super privileges. No restrictions to collections & items.

```javascript
user.getMainToken(function(null, token) {
	console.log(token.key); //key used to login
	console.log(token.ttl); // -1 = no expiration date.
	console.log(token.scope); //[ { collectionName: null, item: null, access: ["GET", "POST", "PUT", "DELETE", "SUPER"]}]
})
```

### account.createToken(options, callback)

- `options` - options for the token
	- `item` - the item to grant access to (optional)
	- `collectionName` - the collection 
	- `ttl` - time in MS for expiration 
	- `access` - (array) scope access. default is `access.all()`

```javascript

//only give access to the posts collection, and only allow reading items
user.createToken({ item: Posts.collection.name, access: [access.POST] }, function(err, token) {
	console.log(token.scope); //[ { collectionName: "posts", item: null, access: ["GET"]}]
});
```

### account.ownItem(item)

makes the account an owner of an item with SUPER privileges on item

```javascript
var p = new Post({ message: "hello!" });
user.ownItem(p);
p.save();
```

### account.shareItem(item, access)

Shares an item with another user

- `item` - item to own
- `access` - access level for the given item. Blank = ALL privileges.

```javascript
var access = require("auth").access;
Post.findOne({message:"hello!"}, function(err, post) {
	user2.shareItem(post, [access.GET]); //ability to only see item
	post.save();
});
```

### account.authorized(item, access)

returns TRUE if the account has access to the item. Note that the result can be variable
depending if whether the given user logs in with a restricted login token. See below.

```javascript

//logged 
user2.authorized(post); //TRUE
user2.authorized(post, [access.POST]); //FALSE
user2.authorized(post, [access.GET]); //TRUE
user2.authorized(post, [access.GET, access.POST]); //TRUE


//login with the post owner, but restrict access with the created
//token above.
User.login({ token: aboveTokenKey }, function(err, user) {
	user.authorized(post, [access.TRUE]); //FALSE
	user.authorized(post, [access.POST]); //FALSE
})
```

### Error account.unauthorized(callback)

Tiny flow-control utility.

### account.addToSearch(query)

adds account to the given search. For example:

```javascript

Post.findOne(user.addToSearch(), function(err, post) {
	user.authorized(post); //TRUE
})

## TODO

- make sub-schemas ownable
- sharing whole collections (job & timer)
- custom authentication schema
- validation of credentials (email/pass)
- Auth.lockdown - prevent models from being saved or serialized if unauthorized
- hooks with [passport](https://github.com/jaredhanson/passport)
