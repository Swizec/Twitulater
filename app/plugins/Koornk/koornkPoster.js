function KoornkPoster()
{
	this.loader = new air.URLLoader();
	this.configureListeners( this.loader );
}

KoornkPoster.prototype. configureListeners = function ( dispatcher )
{
	dispatcher.addEventListener(air.Event.COMPLETE, this.completeHandler);
	dispatcher.addEventListener(air.Event.OPEN, this.openHandler);
	dispatcher.addEventListener(air.ProgressEvent.PROGRESS, this.progressHandler);
	dispatcher.addEventListener(air.SecurityErrorEvent.SECURITY_ERROR, this.securityErrorHandler);
	dispatcher.addEventListener(air.HTTPStatusEvent.HTTP_STATUS, this.httpStatusHandler);
	dispatcher.addEventListener(air.IOErrorEvent.IO_ERROR, this.ioErrorHandler);
}

KoornkPoster.prototype.completeHandler = function ( event )
{
	var loader = air.URLLoader(event.target);
	notifier.showStatus( Language.def( "posting_done_koornk" ) );
	myTweet.empty();
}

KoornkPoster.prototype.openHandler = function ( event )
{
	notifier.showStatus( Language.def( "posting_koornk" ) );
}

KoornkPoster.prototype.progressHandler = function( event )
{
// 	air.trace("progressHandler loaded:" + event.bytesLoaded + " total: " + event.bytesTotal);
}

KoornkPoster.prototype.securityErrorHandler = function ( event )
{
// 	air.trace("securityErrorHandler: " + event);
}

KoornkPoster.prototype.httpStatusHandler = function ( event )
{
	switch ( event.status )
	{
		case 400:
			notifier.showPermanentStatus( Language.def( "posting_rateLimit" ) );
			break;
		case 401:
		case 403:
		case 404:
		case 500:
		case 502:
		case 503:
			notifier.showPermanentStatus( Language.def( "posting_error" ) );
	}
}

KoornkPoster.prototype.ioErrorHandler = function ( event )
{
	notifier.showPermanentStatus( Language.def( "posting_error" ) );
}


KoornkPoster.prototype.tweet = function ( tweet )
{
	var tweetVars = new air.URLVariables();
	tweetVars.status = tweet.text;
	tweetVars.reply_to = tweet.replyToStatus;
	tweetVars.origin = "jw3sr2fE";

	var request = new air.URLRequest( "http://www.koornk.com/api/update/" );
	request.authenticate = false;
	request.data = tweetVars;
	request.method = air.URLRequestMethod.POST;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( twitulaterUser.getAuthHeader() );

	try
	{
		this.loader.load( request );
	}catch ( error )
	{
		notifier.showStatus( Language.def( "posting_error" ) );
	}
}

KoornkPoster.prototype.makeReply = function ( username, replyId, text )
{
	text = unescape( text );
	var newTweet = this.prepareReply( username, text );

	myTweet.add( newTweet );
	myTweet.focus();
	myTweet.replyTo( replyId );
}

KoornkPoster.prototype.prepareReply = function ( username, text )
{
	var hashtags = this.extractHashtags( text );
	var tagtext = "";
	for ( var i = 0; i < hashtags.length; i++ )
	{
		tagtext = tagtext+" "+hashtags[ i ];
	}

	var newTweet = "@"+username+" "+tagtext;

	return newTweet;
}

KoornkPoster.prototype.extractHashtags = function ( text )
{
	var parser = XRegExp.cache( /^#\p{L}+/ );
	var words = text.split( " " );
	var tags = new Array();

	for ( var i = 0; i < words.length; i++ )
	{
		if ( parser.test( words[ i ] ) )
		{
			tags.push( parser.exec( words[ i ] ) );
		}
	}
	return tags;
}

KoornkPoster.prototype.makeRT = function ( username, tweet )
{
	myTweet.value( "RT @"+username+" "+unescape( tweet )+" " );
	myTweet.focus();
}

KoornkPoster.prototype.makeDM = function ( username )
{
	myTweet.value( "D "+username+" " );
	myTweet.focus();
}

KoornkPoster.prototype.follow = function ( followWho, user )
{
	return;
}

KoornkPoster.prototype.unfollow = function ( unfollowWho, user )
{
	return;
}

KoornkPoster.prototype.block = function ( blockWho, user )
{
	return;
}

KoornkPoster.prototype.unblock = function ( unblockWho, user )
{
	return;
}