
function PAL()
{
	this.protocols = pluginLoader.getPlugins( "protocol" );
	this.conversations = new Array();

	this.readers = {};
	this.posters = {};
	this.authorisators = {};
	this.servicers = {};

	for ( var i in this.protocols )
	{
		var name = this.protocols[ i ].displayName;
		this.readers[ name ] = this.protocols[ i ].reader();
		this.posters[ name ] = this.protocols[ i ].poster();
		this.authorisators[ name ] = this.protocols[ i ].authorisator();
		this.servicers[ name ] = this.protocols[ i ].servicer();
	}
}

PAL.prototype.protocolList = function()
{
	var list = new Array();

	for ( var i in this.protocols )
	{
		list.push( this.protocols[ i ].identifier );
	}

	return list;
}

PAL.prototype.normalRead = function ( userId )
{
	var user = twitulaterUser.getUser( userId );
	
	this.readers[ user.protocol ].normalRead( userId );
}

PAL.prototype.searchRead = function ( params )
{
	var user = twitulaterUser.getUser( params.userId );

	this.readers[ user.protocol ].searchRead( params );
}

PAL.prototype.repliesRead = function ( userId )
{
	var user = twitulaterUser.getUser( userId );

	this.readers[ user.protocol ].repliesRead( userId );
}

PAL.prototype.dmRead = function ( userId )
{
	var user = twitulaterUser.getUser( userId );

	this.readers[ user.protocol ].dmRead( userId );
}

PAL.prototype.tweetCommandClickHandler = function ( element )
{
	var user = twitulaterUser.activeUser();
	var poster = this.posters[ user.protocol ];

	var type = element.attr( "type" );
	var username = element.attr( "name" );
	var replyId = element.attr( "replyId" );

	switch ( type )
	{
		case "reply":
			var text = element.attr( "content" );
			poster.makeReply( username, replyId, text );
			break;
		case "rt":
			var text = element.attr( "content" );
			poster.makeRT( username, text );
			break;
		case "dm":
			poster.makeDM( username );
			break;
	}

	return false;
}

PAL.prototype.tweet = function ()
{
	var user = twitulaterUser.activeUser();

	try
	{
		var tweet = this.makeTweetAndCleanGUI();
	}catch ( e )
	{
		return;
	}

	this.posters[ user.protocol ].tweet( tweet );
}

PAL.prototype.makeTweetAndCleanGUI = function ()
{
	var waitForCallback = USAL.shortenBeforePost( function () { PAL.tweet() } );

	if ( !waitForCallback )
	{
		statistics.tweeted()
		var text = this.prepareTweet();
		var replyToStatus = this.replyToStatus();

		return { "text": text, "replyToStatus": replyToStatus };
	}

	throw Exception( "Wait!" );
}

PAL.prototype.prepareTweet = function ()
{
	var tweetText =	myTweet.value();

	tweetText = tweetText.substring( 0, 140 );

	return tweetText;
}

PAL.prototype.replyToStatus = function ()
{
	var statusId = myTweet.getReplyTo();
	return statusId;
}

PAL.prototype.follow = function ( followWho, userId, callback )
{
	var user = twitulaterUser.getUser( userId );

	this.posters[ user.protocol ].follow( followWho, userId, callback );
}

PAL.prototype.unfollow = function ( unfollowWho, userId, callback )
{
	var user = twitulaterUser.getUser( userId );

	this.posters[ user.protocol ].unfollow( unfollowWho, userId, callback );
}

PAL.prototype.block = function ( blockWho, userId, callback )
{
	var user = twitulaterUser.getUser( userId );

	this.posters[ user.protocol ].block( blockWho, userId );
}

PAL.prototype.unblock = function ( unblockWho, userId, callback )
{
	var user = twitulaterUser.getUser( userId );

	this.posters[ user.protocol ].unblock( unblockWho, userId );
}

PAL.prototype.validate = function ( params )
{
	this.authorisators[ params.user.protocol ].validate( params );
}

PAL.prototype.followers = function ( params )
{
	var user = twitulaterUser.getUser( params.userId );
	
	this.authorisators[ user.protocol ].followers( params );
}

PAL.prototype.following = function ( params )
{
	var user = twitulaterUser.getUser( params.userId );
	
	this.authorisators[ user.protocol ].following( params );
}

PAL.prototype.blocked = function ( params )
{
	var user = twitulaterUser.getUser( params.userId );
	
	this.authorisators[ user.protocol ].blocked( params );
}

PAL.prototype.followersParse = function ( followers, userId )
{
	var user = twitulaterUser.getUser( userId );

	return this.servicers[ user.protocol ].followersParse( followers );
}

PAL.prototype.usernameURI = function ( username, userId )
{
	var user = twitulaterUser.getUser( userId );

	return this.servicers[ user.protocol ].usernameURI( username );
}

PAL.prototype.replyToURI = function ( params, userId )
{
	var user = twitulaterUser.getUser( userId );

	return this.servicers[ user.protocol ].replyToURI( params );
}

PAL.prototype.finishedRetrieveStatus = function ( params, userId )
{
	var user = twitulaterUser.getUser( userId );

	return this.servicers[ user.protocol ].finishedRetrieveStatus( params );
}

PAL.prototype.finishedRetrieveGrowl = function ( params, userId )
{
	var user = twitulaterUser.getUser( userId );
	params.username = user.username;

	return this.servicers[ user.protocol ].finishedRetrieveGrowl( params );
}

PAL.prototype.conversationThread = function ( event )
{
	event.preventDefault();
	
	var tweetId = $(this).attr( "tweetId" );
	var userId = $(this).attr( "userId" );
	
	var conversation = new ConversationThread( userId, tweetId );
	conversation.initiate();
	
	PAL.conversations.push( conversation );
}

PAL.prototype.fetchTweet = function ( params )
{
	var user = twitulaterUser.getUser( params.userId );
	
	this.readers[ user.protocol ].readTweet( params );
}

PAL.prototype.addTweetToConversations = function ( tweet )
{
	if ( tweet.reply_to_id == "" )
	{
		return;
	}
	
	for ( var i in this.conversations )
	{
		if ( this.conversations[ i ].shouldAddTweet( tweet ) )
		{
			this.conversations[ i ].addTweetToView( tweet );
		}
	}
}

PAL.prototype.fetchPerson = function ( params )
{
	var user = twitulaterUser.getUser( params.userId );
	
	this.servicers[ user.protocol ].fetchPerson( params );
}