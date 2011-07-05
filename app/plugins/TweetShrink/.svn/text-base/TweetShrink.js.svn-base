function TweetShrink()
{
	this.identifier = "TweetShrink";
	this.displayName = "TweetShrink";
	this.type = "service";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "Enables shrinking your tweets when they are too long";
	
	eventMaster.registerListener( eventMaster.TWEET_TOO_LONG, this.showGUI );
	eventMaster.registerListener( eventMaster.TWEET_NOT_TOO_LONG, this.hideGUI );
}

TweetShrink.prototype.showGUI = function ()
{
	if ( $("#shrinkTweet").size() <= 0 )
	{
		$("#input #extraButtons").append( "<span id=\"shrinkTweet\">Shrink Tweet</span><br/>");
		$("#shrinkTweet").styledButton({
						"action" : function () { pluginLoader.getPlugin( "TweetShrink" ).shrink() }
					});
	}else
	{
		$("#shrinkTweet").css( "display", "block" );
	}
}

TweetShrink.prototype.hideGUI = function ()
{
	$("#shrinkTweet").css( "display", "none" );
}

TweetShrink.prototype.shrink = function ()
{
	var tweet = new air.URLVariables();
	tweet.text = myTweet.value();

	var loader = new air.URLLoader();
	loader.addEventListener( air.Event.COMPLETE, this.shrunkTweet );
	loader.addEventListener( air.IOErrorEvent.IO_ERROR, this.errorShrinking );

	var request = new air.URLRequest( "http://tweetshrink.com/shrink" );
	request.authenticate = false;
	request.data = tweet;
	request.method = air.URLRequestMethod.GET;

	notifier.showStatus( "Shrinking tweet" );

	loader.load( request );
}

TweetShrink.prototype.shrunkTweet = function( event )
{
	var jsonString = event.target.data;
	var shrink = JSON.parse( jsonString );

	notifier.showStatus( "Shrunk by "+shrink.difference+" characters" );
	myTweet.value( shrink.text );
}

TweetShrink.prototype.errorShrinking = function ( event )
{
	notifier.showStatus( "Error shrinking tweet" );
}