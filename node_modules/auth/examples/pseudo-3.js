var db;

//how do we handle permissions for super users?
//simple answer is - user permissions have root privileges - there's only ONE root
//level, which is the user itself. a "super" tag maybe applied, but after that, privileges
//

var  user1 = user(),

//user2 can be a registered user, or it can be a 
//public user that's automatically logged in. This could be the 
//default option.
user2 = user();


//this sort of thing isn't necessary since authentication would be bubbled
//up to the top-most item. in which case, "comments", is owned by post. "Post" is owned
//by user. The authentication would work as follows:
//auth -> posts -> comments
db.collection("post").owns("comments");


//in this case, post is owned by community. HOWEVER, "post" can still be shared with
//other users. this use case just follows a different authentication path.
//auth -> community -> post -> comments
//where the post looks to see if the community is its owner - in which case 
//modifications can be made against the given post. Before that, community
//checks if a user is the given owner. 
//how do we give permissions for the owner of given community to make changes
//to any post? We could modify the query such that if the owner is of the community,
//q = { community: _id }, but if the owner is of the poist, then q = { u: u, p: p }
//In other words, think of this as a faster method short of adding super users in each item which... fndskfsfklds
db.collection("community").owns("post").owns("");


//here's a different use case. This would require watching "repositories" for any
//NEW repository that comes in, instead of one shot.
db.collection("repositories").owns("repository");


//1 queue job
//2 check if u1 owns someId
//3. add user2 under "owners" in the given item
user1.shareItem("someId", user2, function() {
	//on share
});

//1 add job that gets triggered when a new repository is inserted
//2. follow step "shareItem" when a new item is added
user1.shareCollection("repositories", user2, function() {

});

//takes permissions away from the given user
user1.takeAwayItem("someId", user2);
	//cron.addJob({ from: user1, update: { $set: permissions: [] }}, to: user2 })


//takes away privileges for a particular user
user1.takeAwayCollection("repositories", user2);	
	//cron.removeJob({ from: user1, collection: "repositories", to: user2 })