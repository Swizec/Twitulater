function TwitterReader()
{
}

TwitterReader.prototype.setupURILoader = function ( params )
{
	var listener = new TwitterReadListener( params.user, params.feed );

	if ( typeof( params.callback ) == "function" )
	{
		listener.setCallback( params.callback );
	}else
	{
		listener.setCallback( function ( user, tweets, feed) {
				contentRefresher.displayAndStoreData( user, tweets, feed );
			} );
	}

	var loader = new air.URLLoader();
	this.configureListeners( params.user, loader, listener );

	return loader;
}

TwitterReader.prototype.configureListeners =  function ( user, dispatcher, listener )
{
	var thisReference = this;

	dispatcher.addEventListener( air.Event.COMPLETE, function ( event ) { listener.completeHandler( event ) } );
	dispatcher.addEventListener( air.Event.OPEN, function ( event ) {listener.openHandler( event ) } );
	dispatcher.addEventListener( air.ProgressEvent.PROGRESS, function ( event ) {listener.progressHandler( event ) } );
	dispatcher.addEventListener( air.SecurityErrorEvent.SECURITY_ERROR, function ( event ) {listener.securityErrorHandler( event ) } );
	dispatcher.addEventListener( air.HTTPStatusEvent.HTTP_STATUS, function ( event ) {listener.httpStatusHandler( event ) } );
	dispatcher.addEventListener( air.IOErrorEvent.IO_ERROR, function ( event ) {listener.ioErrorHandler( event ) } );
}

TwitterReader.prototype.normalRead = function ( user )
{
	var request = this.setupNormalRequest( user );
	this.read( {
			"user": user,
			"request": request,
			"feed": "normal"
		});
}

TwitterReader.prototype.read = function ( params )
{
	var loader = this.setupURILoader( params );
	loader.load( params.request );
}

TwitterReader.prototype.setupNormalRequest = function ( user )
{
	var url = "https://twitter.com/statuses/friends_timeline.json";
	
	var variables = {}
	var sinceId = dataStorage.getSinceId( user );
	variables.count = 200;
	if ( sinceId > 0 )
	{
		variables.since_id = sinceId;
	}

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( user, "GET", url, variables ) );
	request.data = this.convertVariables( variables );
	
	return request;
}

TwitterReader.prototype.convertVariables = function ( variables )
{
	var urlvariables = new air.URLVariables();
	
	for ( var k in variables )
	{
		urlvariables[k] = variables[k];
	}

	return urlvariables;
}

TwitterReader.prototype.searchRead = function ( params )
{
	var request = this.setupSearchRequest( params );
	this.read({
			"user": params.userId,
			"request": request,
			"feed": "search",
			"callback": params.callback
		});
}

TwitterReader.prototype.setupSearchRequest = function ( params )
{
	var url = this.generateSearchURL( params );

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	
	return request;
}

TwitterReader.prototype.generateSearchURL = function ( params )
{
	return "http://search.twitter.com/search.json?q="+encodeURIComponent( params.term )+"&show_user=true";
}

TwitterReader.prototype.repliesRead = function ( user )
{
	var request = this.setupRepliesRequest( user );
	this.read({
			"user": user,
			"request": request,
			"feed": "replies"
		});
}

TwitterReader.prototype.setupRepliesRequest = function ( user )
{
	var url = "https://twitter.com/statuses/replies.json";
	
	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( user, "GET", url, {} ) );
	
	return request;
}

TwitterReader.prototype.dmRead = function ( user )
{
	var request = this.setupDMRequest( user );
	this.read({
			"user": user,
			"request": request,
			"feed": "dm"
		});
}

TwitterReader.prototype.setupDMRequest = function ( user )
{
	var url = "https://twitter.com/direct_messages.json";

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( pluginLoader.getPlugin( "Twitter" ).authorisator().getAuthHeader( user, "GET", url, {} ) );
	
	return request;
}

TwitterReader.prototype.readTweet = function ( params )
{
	var request = this.setupSingleRequest( params.userId, params.tweetId );
	this.read({
			"user": params.userId, 
			"callback": params.callback,
			"request": request,
			"feed": "convo"
		});
}

TwitterReader.prototype.setupSingleRequest = function ( user, tweetId )
{
	var url = this.generateSingleURL( user, tweetId );

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	
	return request;
}

TwitterReader.prototype.generateSingleURL = function ( user, tweetId )
{
	return "https://twitter.com/statuses/show/"+tweetId+".json";
}

TwitterReader.prototype.readOne = function ()
{
	var loader = this.setupURILoader({ "user": user });
	loader.load( this.requests[ user ] );
}

function TwitterReadListener( user, feed )
{
	this.user = user;
	this.feed = feed;
	this.completeCallback = null;
}

TwitterReadListener.prototype.setCallback = function ( callback )
{
	this.completeCallback = callback;
}

TwitterReadListener.prototype.completeHandler = function (event)
{
	var loader = event.target;
	var jsonString = loader.data;
	var tweets = JSON.parse( jsonString );

	var feed = this.feed;
	
	this.completeCallback( this.user, tweets, feed );
}

TwitterReadListener.prototype.openHandler = function (event)
{
	notifier.showFootStatus( Language.def( "reading" ) );
}

TwitterReadListener.prototype.progressHandler = function (event)
{
// 	percentage = event.bytesTotal/event.bytesLoaded*100;
// 	$("#progress").css("width", percentage );
// 	air.trace( percentage+"%" );
}

TwitterReadListener.prototype.securityErrorHandler = function (event)
{
// 	air.trace("securityErrorHandler: " + event);
}

TwitterReadListener.prototype.httpStatusHandler = function (event)
{
//	air.trace( event );
	switch ( event.status )
	{
		case 400:
			notifier.showFootStatus( Language.def( "reading_rateLimit" ) );
			break;
		case 401:
		case 403:
		case 404:
		case 500:
		case 502:
		case 503:
			notifier.showFootStatus( Language.def( "reading_error" ) );
	}
}

TwitterReadListener.prototype.ioErrorHandler = function (event)
{
// 	contentRefresher.unlock( this.user );
// 	var user = .loaderToUser[ event.target ];
// 	$("#status").html( "Something went wrong" );
}