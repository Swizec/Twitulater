function SocialGraph ( db, user )
{
	this.db = db;
	this.user = user;
	this.followers = new ListBuilder( "followers", this.user );
	this.following = new ListBuilder( "following", this.user );
	this.blocked = new ListBuilder( "blocked", this.user );
}

SocialGraph.prototype.refresh = function ()
{
	this.followers.refresh();
	this.following.refresh();
	this.blocked.refresh();
}

SocialGraph.prototype.isFollowing = function ( id )
{
	return this.following.members.got( id );
}

SocialGraph.prototype.isBlocking = function ( id )
{
	return this.blocked.members.got( id );
}

SocialGraph.prototype.follow = function ( id )
{
	this.following.add( id );
}

SocialGraph.prototype.unfollow = function ( id )
{
	this.following.remove( id );
}

SocialGraph.prototype.block = function ( id )
{
	this.blocked.add( id );
}

SocialGraph.prototype.unblock = function ( id )
{
	this.blocked.remove( id );
}