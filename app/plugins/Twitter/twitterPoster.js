function TwitterPoster()
{
	this.loader = new air.URLLoader();
	this.configureListeners( this.loader );
}

TwitterPoster.prototype. configureListeners = function ( dispatcher )
{
	dispatcher.addEventListener(air.Event.COMPLETE, this.completeHandler);
	dispatcher.addEventListener(air.Event.OPEN, this.openHandler);
	dispatcher.addEventListener(air.ProgressEvent.PROGRESS, this.progressHandler);
	dispatcher.addEventListener(air.SecurityErrorEvent.SECURITY_ERROR, this.securityErrorHandler);
	dispatcher.addEventListener(air.HTTPStatusEvent.HTTP_STATUS, this.httpStatusHandler);
	dispatcher.addEventListener(air.IOErrorEvent.IO_ERROR, this.ioErrorHandler);
}

TwitterPoster.prototype.completeHandler = function ( event )
{
	var loader = air.URLLoader(event.target);
	notifier.showStatus( Language.def( "posting_done" ) );
	myTweet.empty();
}

TwitterPoster.prototype.openHandler = function ( event )
{
	notifier.showPermanentStatus( Language.def( "posting" ) );
}

TwitterPoster.prototype.progressHandler = function( event )
{
// 	air.trace("progressHandler loaded:" + event.bytesLoaded + " total: " + event.bytesTotal);
}

TwitterPoster.prototype.securityErrorHandler = function ( event )
{
// 	air.trace("securityErrorHandler: " + event);
}

TwitterPoster.prototype.httpStatusHandler = function ( event )
{
	air.trace( event );
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

TwitterPoster.prototype.ioErrorHandler = function ( event )
{
	notifier.showPermanentStatus( Language.def( "posting_error" ) );
}


TwitterPoster.prototype.tweet = function ( tweet )
{
	var url = "https://twitter.com/statuses/update.json";
	
	var variables = {}
	variables.source = "twitulater";
	variables.status = tweet.text;
	variables.in_reply_to_status_id = tweet.replyToStatus;
	
	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.data = this.convertVariables( variables );
	request.method = air.URLRequestMethod.POST;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( twitulaterUser.activeUser().id, "POST", url, variables ) );

	try
	{
		this.loader.load( request );
	}catch ( error )
	{
		notifier.showStatus( Language.def( "posting_error" ) );
	}
}

TwitterPoster.prototype.convertVariables = function ( variables )
{
	var urlvariables = new air.URLVariables();
	
	for ( var k in variables )
	{
		urlvariables[k] = variables[k];
	}

	return urlvariables;
}

TwitterPoster.prototype.makeReply = function ( username, replyId, text )
{
	text = unescape( text );
	var newTweet = this.prepareReply( username, text );

	myTweet.add( newTweet );
	myTweet.replyTo( replyId );
	myTweet.focus();
}

TwitterPoster.prototype.prepareReply = function ( username, text )
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

TwitterPoster.prototype.extractHashtags = function ( text )
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

TwitterPoster.prototype.makeRT = function ( username, tweet )
{
	myTweet.value( "RT @"+username+" "+unescape( tweet )+" " );
	myTweet.focus();
}

TwitterPoster.prototype.makeDM = function ( username )
{
	myTweet.value( "D "+username+" " );
	myTweet.focus();
}

TwitterPoster.prototype.follow = function ( followWho, user, callback )
{
	var url = "https://twitter.com/friendships/create/"+followWho+".json";
	
	var variables = {}
	variables.follow = true;
	
	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.data = this.convertVariables( variables );
	request.method = air.URLRequestMethod.POST;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( twitulaterUser.activeUser().id, "POST", url, variables ) );

	var thisReference = this;

	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, function ( event ) {
			if ( typeof( callback ) == "function" )
			{
				callback(); 
			}
			thisReference.followed( event ) 
		});
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, function ( event ) { thisReference.followError( event ) });

	loader.load( request );
}

TwitterPoster.prototype.followed = function ( event )
{
	var data = JSON.parse( event.target.data );
	
	notifier.showStatus( Language.def( "following" ).replace( /\(u\)/, data.screen_name ) );
}

TwitterPoster.prototype.followError = function ( event )
{
	air.trace( event.target.data );
	notifier.showStatus( Language.def( "following_error" ) );
}

TwitterPoster.prototype.unfollow = function ( unfollowWho, user, callback )
{
	var url = "https://twitter.com/friendships/destroy/"+unfollowWho+".json";
	
	var variables = {}
	variables.unfollow = true;
	
	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.data = this.convertVariables( variables );
	request.method = air.URLRequestMethod.POST;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( twitulaterUser.activeUser().id, "POST", url, variables ) );

	var thisReference = this;

	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, function ( event ) {
			if ( typeof( callback ) == "function" )
			{
				callback(); 
			}
			thisReference.unfollowed( event ) 
		});
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, function ( event ) { thisReference.unfollowError( event ) });

	loader.load( request );
}

TwitterPoster.prototype.unfollowed = function ( event )
{
	var data = JSON.parse( event.target.data );
	
	notifier.showStatus( Language.def( "unfollowing" ).replace( /\(u\)/, data.screen_name ) );
}

TwitterPoster.prototype.unfollowError = function ( event )
{
	air.trace( event.target.data );
	notifier.showStatus( Language.def( "unfollowing_error" ) );
}

TwitterPoster.prototype.block = function ( blockWho, user, callback )
{
	var url = "https://twitter.com/blocks/create/"+blockWho+".json";
	
	var variables = {}
	variables.block = true;
	
	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.data = this.convertVariables( variables );
	request.method = air.URLRequestMethod.POST;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( twitulaterUser.activeUser().id, "POST", url, variables ) );
	
	var thisReference = this;

	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, function ( event ) {
			if ( typeof( callback ) == "function" )
			{
				callback(); 
			}
			thisReference.blocked( event ) 
		});
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, function ( event ) { thisReference.blockError( event ) });

	loader.load( request );
}

TwitterPoster.prototype.blocked = function ( event )
{
	var data = JSON.parse( event.target.data );
	
	notifier.showStatus( Language.def( "blocking" ).replace( /\(u\)/, data.screen_name ) );
}

TwitterPoster.prototype.blockError = function ( event )
{
	air.trace( event.target.data );
	notifier.showStatus( Language.def( "blocking_error" ) );
}

TwitterPoster.prototype.unblock = function ( unblockWho, user, callback )
{
	var url = "https://twitter.com/blocks/destroy/"+unblockWho+".json";
	
	var variables = {}
	variables.unblock = true;
	
	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.data = this.convertVariables( variables );
	request.method = air.URLRequestMethod.POST;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( twitulaterUser.activeUser().id, "POST", url, variables ) );

	var thisReference = this;

	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, function ( event ) {
			if ( typeof( callback ) == "function" )
			{
				callback(); 
			}
			thisReference.unblocked( event ) 
		});
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, function ( event ) { thisReference.unblockError( event ) });

	loader.load( request );
}

TwitterPoster.prototype.unblocked = function ( event )
{
	var data = JSON.parse( event.target.data );
	
	notifier.showStatus( Language.def( "unblocking" ).replace( /\(u\)/, data.screen_name ) );
}

TwitterPoster.prototype.unblockError = function ( event )
{
	air.trace( event.target.data );
	notifier.showStatus( Language.def( "unblocking_error" ) );
}