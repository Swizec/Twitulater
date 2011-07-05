function TwitLonger()
{
	this.identifier = "TwitLonger";
	this.displayName = "TwitLonger";
	this.type = "service";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "Enables you to post very long tweets";
	
	eventMaster.registerListener( eventMaster.TWEET_TOO_LONG, this.showGUI );
	eventMaster.registerListener( eventMaster.TWEET_NOT_TOO_LONG, this.hideGUI );
}

TwitLonger.prototype.showGUI = function ()
{
	if ( $("#twitLonger").size() <= 0 )
	{
		$("#input #extraButtons").append( "<span id=\"twitLonger\">Tweet via TwitLonger</span><br/>");
		$("#twitLonger").styledButton({
						"action" : function () { pluginLoader.getPlugin( "TwitLonger" ).twitLonger() }
					});
	}else
	{
		$("#twitLonger").css( "display", "block" );
	}
}

TwitLonger.prototype.hideGUI = function ()
{
	$("#twitLonger").css( "display", "none" );
}

TwitLonger.prototype.twitLonger = function ()
{
	var tweet = new air.URLVariables();
	tweet.message = escape( myTweet.value() );
	tweet.application = "twitulater";
	tweet.api_key = "GTJvuay23qMCYw6s";
	tweet.username = twitulaterUser.activeUser().username;
	tweet.in_reply = myTweet.getReplyTo();
	
	var loader = new air.URLLoader();
	loader.addEventListener( air.Event.COMPLETE, this.twitLonged );
	loader.addEventListener( air.IOErrorEvent.IO_ERROR, this.errorTwitLonging );
	
	var request = new air.URLRequest( "http://www.twitlonger.com/api_post" );
	request.authenticate = false;
	request.data = tweet;
	request.method = air.URLRequestMethod.POST;

	notifier.showStatus( "TwitLonger-ing" );

	loader.load( request );
}

TwitLonger.prototype.twitLonged = function( event )
{
	var xmlResponse = event.target.data;
	var parser = XRegExp.cache( "<content>(.+)</content>", "s" );
	var content = xmlResponse.replace( /[\n\t]/g, "" ).match( parser )[1];
	
	notifier.showStatus( "Twitlonged" );
	myTweet.value( content );
	PAL.tweet();
}

TwitLonger.prototype.errorTwitLonging = function ( event )
{
	notifier.showStatus( "Error tweeting long" );
}