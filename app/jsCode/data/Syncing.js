function Syncing ()
{
	this.data = {}
}

Syncing.prototype.addUser = function ( userId )
{
	var user = twitulaterUser.getUser( user );
	this.data[ userId ] = new Syncdata();
	this.data[ userId ].nick = user.username;
	this.data[ userId ].protocol = user.protocol;
}

Syncing.prototype.sync = function ()
{
}

function SyncData ()
{
	this.searches = new Array();
	this.groups = new Array();
	this.seen = new Array();
	this.ranks = {};
}