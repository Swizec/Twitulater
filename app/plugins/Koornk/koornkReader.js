function KoornkReader()
{
}

KoornkReader.prototype.setupURILoader = function ( params )
{
	var listener = new KoornkReadListener( params.user, params.feed );

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

KoornkReader.prototype.configureListeners =  function ( user, dispatcher, listener )
{
	var thisReference = this;

	dispatcher.addEventListener( air.Event.COMPLETE, function ( event ) { listener.completeHandler( event ) } );
	dispatcher.addEventListener( air.Event.OPEN, function ( event ) { listener.openHandler( event ) } );
	dispatcher.addEventListener( air.ProgressEvent.PROGRESS, function ( event ) { listener.progressHandler( event ) } );
	dispatcher.addEventListener( air.SecurityErrorEvent.SECURITY_ERROR, function ( event ) { listener.securityErrorHandler( event ) } );
	dispatcher.addEventListener( air.HTTPStatusEvent.HTTP_STATUS, function ( event ) { listener.httpStatusHandler( event ) } );
	dispatcher.addEventListener( air.IOErrorEvent.IO_ERROR, function ( event ) { listener.ioErrorHandler( event ) } );
}

KoornkReader.prototype.normalRead = function ( user )
{
	var request = this.setupNormalRequest( user );
	this.read( {
			"user": user,
			"request": request,
			"feed": "normal"
		});
}

KoornkReader.prototype.read = function ( params )
{
	var loader = this.setupURILoader( params );
	loader.load( params.request );
}

KoornkReader.prototype.setupNormalRequest = function ( user )
{
	var url = this.generateReadURL( user );

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( this.getAuthHeader( user ) );
	
	return request;
}

KoornkReader.prototype.getAuthHeader = function ( user )
{
	var loginData = twitulaterUser.getUser( user );
	return new air.URLRequestHeader( "Authorization", "Basic "+btoa( loginData.username+":"+loginData.password ) );
}

KoornkReader.prototype.generateReadURL = function ( user )
{
	var sinceId = dataStorage.getSinceId( user );

//	if ( sinceId == "" )
//	{
		return "http://www.koornk.com/api/recent/?limit=100";
//	}else
//	{
//		return "http://www.koornk.com/api/recent/"+sinceId+"&limit=1000";
//	}
}

KoornkReader.prototype.searchRead = function ( user )
{
// 	this.setupSearchRequest( user );
// 	this.read( user );
}

KoornkReader.prototype.setupSearchRequest = function ( user )
{
	var url = this.generateSearchURL( user );

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	
	return request;
}

KoornkReader.prototype.generateSearchURL = function ( user )
{
	sinceId = dataStorage.getSearchSinceId( user );
	return "http://search.twitter.com/search.json"+sinceId+"&q=%40"+twitulaterUser.getUser( user ).username;
}

KoornkReader.prototype.repliesRead = function ( user )
{
	var request = this.setupRepliesRequest( user );
	this.read( {
			"user": user,
			"request": request,
			"feed": "replies"
		});
}

KoornkReader.prototype.setupRepliesRequest = function ( user )
{
	var url = this.generateRepliesURL( user );

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	
	return request;
}

KoornkReader.prototype.generateRepliesURL = function ( user )
{
	return "http://www.koornk.com/api/replies/";
}

KoornkReader.prototype.dmRead = function ( user )
{
// 	this.setupSearchRequest( user );
// 	this.read( user );
}

KoornkReader.prototype.readTweet = function ( params )
{
	var request = this.setupSingleRequest( params.userId, params.tweetId );
	this.read({
			"user": params.userId, 
			"callback": params.callback,
			"request": request,
			"feed": "convo"
		});
}

KoornkReader.prototype.setupSingleRequest = function ( user, tweetId )
{
	var url = this.generateSingleURL( user, tweetId );

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	
	return request;
}

KoornkReader.prototype.generateSingleURL = function ( user, tweetId )
{
	return "http://koornk.com/status/"+tweetId+"/";
}

function KoornkReadListener( user, feed )
{
	this.user = user;
	this.feed = feed;
	this.completeCallback = null;
}

KoornkReadListener.prototype.setCallback = function ( callback )
{
	this.completeCallback = callback;
}

KoornkReadListener.prototype.completeHandler = function (event)
{
	var loader = event.target;
	var dataString = loader.data;
		
	if ( dataString.indexOf( "<!DOCTYPE" ) < 0 )
	{
		var tweets = this.parseJson( dataString );
	}else
	{
		var tweets = this.parseHTML( dataString );
	}
	
	var feed = this.feed;
	
	this.completeCallback( this.user, tweets, feed );
}

KoornkReadListener.prototype.parseJson = function ( jsonString )
{
	var clucks = JSON.parse( jsonString );
	var tweets = this.clucksToTweets( clucks.list );
	
	return tweets;
}

KoornkReadListener.prototype.clucksToTweets = function ( clucks )
{
	var tweets = new Array();
	for ( var i = 0; i < clucks.length; i++ )
	{
		var tmp = {};

		tmp.id = clucks[ i ].status_id;
		tmp.created_at = this.timestampToUTC( clucks[ i ].date_timestamp );
		tmp.text = clucks[ i ].status;
		tmp.source = clucks[ i ].origin;
		tmp.in_reply_to_status_id = this.replyToId( clucks[ i ].in_reply_to_status_id );
		tmp.in_reply_to_screen_name = this.replyToName( clucks[ i ].in_reply_to_screen_name );
		tmp.user = {};
		tmp.user.id = 0;
		tmp.user.name = clucks[ i ].author;
		tmp.user.screen_name  = clucks[ i ].author;
		tmp.user.location  = "";
		tmp.user.description  = "";
		tmp.user.profile_image_url  = clucks[ i ].author_image_url;
		tmp.user.followerCount  = 0;
		tmp.user.url = "";

		tweets.push( tmp );
	}

	return tweets;
}

KoornkReadListener.prototype.timestampToUTC = function ( timestamp )
{
	var time = new Date();
	time.setTime( timestamp*1000 );

	return time.toUTCString();
}

KoornkReadListener.prototype.replyToId = function ( id )
{
	if ( typeof( id ) != "undefined" )
	{
		return id;
	}else
	{
		return 0;
	}
}

KoornkReadListener.prototype.replyToName = function ( name )
{
	if ( typeof( name ) != "undefined" )
	{
		return name;
	}else
	{
		return null;
	}
}

KoornkReadListener.prototype.parseHTML = function ( html )
{
	var cluckParser = XRegExp.cache( "<div style=\"margin: 0 0 0 60px; padding: 10px 0 0 0; width: 630px;\" class=\"status-content\" >.*?</div>", "gs" );
	var clucks = html.match( cluckParser );
	var tweets = new Array();
	
	
	
	for ( var i in clucks )
	{
		var cluck = clucks[ i ];
		var tmp = {};
		
		tmp.id = Number( PAL.readers[ "Koornk" ].requests[ this.user ].url.match( /[0-9]+/ ) );
		tmp.created_at = 0;
		tmp.text = String( cluck.match( /<span class="msgtxt" id="status-text">(.+?)<\/span>/s ) );
		tmp.source = "KoornkHTML";
		tmp.in_reply_to_status_id = Number( cluck.match( /<a href="\/status\/(.+?)\/">in reply to/ )[1] );
		tmp.in_reply_to_screen_name = cluck.match( /<a href="\/status\/.+?\/">in reply to (.+?)<\/a>/ )[1];
		tmp.user = {};
		tmp.user.id = 0;
		tmp.user.name = cluck.match( /<strong>(.+?)<\/strong>/ );
		tmp.user.screen_name  = cluck.match( /<strong>(.+?)<\/strong>/ );
		tmp.user.location  = "";
		tmp.user.description  = "";
		tmp.user.profile_image_url  = "";
		tmp.user.followerCount  = 0;
		tmp.user.url = "";
		
		tweets.push( tmp );
	}

	return tweets;
}

KoornkReadListener.prototype.openHandler = function (event)
{
	notifier.showFootStatus( Language.def( "reading" ) );
}

KoornkReadListener.prototype.progressHandler = function (event)
{
// 	percentage = event.bytesTotal/event.bytesLoaded*100;
// 	$("#progress").css("width", percentage );
// 	air.trace( percentage+"%" );
}

KoornkReadListener.prototype.securityErrorHandler = function (event)
{
// 	air.trace("securityErrorHandler: " + event);
}

KoornkReadListener.prototype.httpStatusHandler = function (event)
{
// 	contentRefresher.unlock( this.user );

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

KoornkReadListener.prototype.ioErrorHandler = function (event)
{
// 	contentRefresher.unlock( this.user );
// 	var user = .loaderToUser[ event.target ];
// 	$("#status").html( "Something went wrong" );
}