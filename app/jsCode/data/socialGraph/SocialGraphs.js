function SocialGraphs()
{
	this.graphs = {};
}

SocialGraphs.prototype.getGraph = function ( user )
{
	if ( typeof( this.graphs[ user ] ) == "undefined" )
	{
		this.graphs[ user ] = new SocialGraph( dataStorage.db, twitulaterUser.getUser( user ) );
	}
	
	return this.graphs[ user ];
}

SocialGraphs.prototype.following = function ( user, id )
{
	return this.getGraph( user ).isFollowing( id );
}

SocialGraphs.prototype.blocking = function ( user, id )
{
	return this.getGraph( user ).isBlocking( id );
}

SocialGraphs.prototype.follow = function ( user, id, callback )
{
	PAL.follow( id, user, callback );
	this.getGraph( user ).follow( id );
}

SocialGraphs.prototype.unfollow = function ( user, id, callback )
{
	PAL.unfollow( id, user, callback );
	this.getGraph( user ).unfollow( id );
}

SocialGraphs.prototype.block = function ( user, id, callback )
{
	PAL.block( id, user, callback );
	this.getGraph( user ).block( id );
}

SocialGraphs.prototype.unblock = function ( user, id, callback )
{
	PAL.unblock( id, user, callback );
	this.getGraph( user ).unblock( id );
}