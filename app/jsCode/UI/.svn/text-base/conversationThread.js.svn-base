function ConversationThread( userId, tweetId )
{
	this.lastTweet = tweetId;
	this.displayWindow = null;
	this.userId = userId;
	this.tweets = {};
}

ConversationThread.prototype.initiate = function ()
{
	this.openWindow();
	this.addTweet( this.lastTweet );
}

ConversationThread.prototype.openWindow = function ()
{
	var dialog = new Dialog( "conversation" );
	var thisRef = this;
	
	this.displayWindow = window.open( "", "", "width=300,height=500,toolbar=0,resizable=1" );
	this.displayWindow.document.write( dialog.content );
	this.displayWindow.onunload = function () { thisRef.windowClosed() };
	
	mainDisplay.registerWindow( this.displayWindow );
	this.windowOpen = true;
}

ConversationThread.prototype.addTweet = function ( tweetId )
{
	var thisRef = this;
	PAL.fetchTweet( { "userId": this.userId,
				"tweetId": tweetId,
				"callback": function ( userId, tweet, feed ) { 
							thisRef.displayTweet( userId, tweet, feed );
						}
					});
}

ConversationThread.prototype.displayTweet = function ( userId, tweet, feed )
{
	tweet = services.parseData({
			"user" : userId, 
			"data" : new Array( tweet ), 
			"feed" : feed })[ 0 ];
	
	this.addTweetToView( tweet );
	
	if ( tweet.reply_to_id != "" )
	{
		this.addTweet( tweet.reply_to_id );
	}
}

ConversationThread.prototype.addTweetToView = function ( tweet )
{
	if ( this.tweets[ tweet.id ] )
	{
		return;
	}
	
	this.tweets[ tweet.id ] = true;
	
	var html = tweet.toHTML();
	
	this.display( tweet, html );
	
	tweet.activateInConversation( this.displayWindow );
}

ConversationThread.prototype.display = function ( tweet, html )
{
	var insertionPoint = $(this.displayWindow.document).find( ".replyto_"+tweet.id );
	
	if ( insertionPoint.size() > 0 )
	{
		insertionPoint.before( html );
	}else
	{
		$(this.displayWindow.document).find( "ul" ).append( html );
		this.lastTweet = tweet.id;
	}
}

ConversationThread.prototype.shouldAddTweet = function ( tweet )
{
	return ( this.lastTweet == tweet.id || this.lastTweet == tweet.reply_to_id ) && this.windowOpen == true;
}

ConversationThread.prototype.windowClosed = function ()
{
	this.windowOpen = false;
}