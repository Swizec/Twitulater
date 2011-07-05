function Groups ()
{
	this.bundles = {};
}

Groups.prototype.initUser = function ( userId )
{
	if ( typeof( this.bundles[ userId ] ) == "undefined" )
	{
		this.bundles[ userId ] = new GroupBundle( userId );
	}
}

Groups.prototype.config = function ()
{
	var interface = new GroupsConfig( this.bundles )
	interface.open();
}

Groups.prototype.isGroupedTweet = function ( tweet )
{
	return this.bundles[ tweet.toUser ].inGroup( tweet.poster.id );
}

Groups.prototype.memberOfGroups = function ( tweet )
{
	return this.bundles[ tweet.toUser ].memberOfGroups( tweet.poster.id );
}

Groups.prototype.removeGroup = function ( userId, groupId )
{
	this.bundles[ userId ].remove( groupId );
}
