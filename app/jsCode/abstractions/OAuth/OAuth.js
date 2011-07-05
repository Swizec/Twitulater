function OAuth()
{
	this.consumer_key = "rxuSOBCAXAiqpMseuKN1gQ";
	this.consumer_secret = "34Ld3xKxos6VSqfIei1YfxKvFogQJ7vQBbv8d7imA";
}

OAuth.prototype.initialise = function ( callback )
{
	var header = new OAuthHeader({
			"method" : "GET",
			"uri" : "http://twitter.com/oauth/request_token",
			"key" : [this.consumer_secret, ""],
			"type" : "HTTPheader"
		});
	header.add( ["oauth_consumer_key", this.consumer_key ] );
	
	var request = new air.URLRequest( "http://twitter.com/oauth/request_token" );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	
	request.requestHeaders = new Array( new air.URLRequestHeader( "Authorization", header.generate() ) );
	
	var loader = new air.URLLoader();
	var thisRef = this;
	loader.addEventListener( air.Event.COMPLETE, function ( event ) { thisRef.gotRequestToken( event, callback ) } );
	loader.addEventListener( air.IOErrorEvent.IO_ERROR, function ( event ) { air.trace( event ) } );
	
	loader.load( request );
}

OAuth.prototype.gotRequestToken = function ( event, callback )
{
	var token = parseUri( "http://blabla.com?"+event.target.data ).queryKey;
	
	var url = new OAuthHeader({
			"method" : "GET",
			"uri" : "http://twitter.com/oauth/authorize",
			"key" : [this.consumer_secret, token.oauth_token_secret],
			"type" : "uri"
		});
	url.add([ "oauth_callback", "oob" ]);
	url.add([ "oauth_token", token.oauth_token ]);
	
	var url = url.generate();
	
 	this.authoriseDialog = window.open( url, "OAuth", "width=780,height=420,resizable=1,status=1" );
 	this.authoriseDialog.moveTo( window.nativeWindow.x+10, window.nativeWindow.y+50 );
	
 	mainDisplay.registerWindow( this.authoriseDialog );
	callback( token );
}

OAuth.prototype.accessToken = function ( pin, callback, token )
{
	this.accessCallback = callback;

	var header = new OAuthHeader({
			"method" : "GET",
			"uri" : "http://twitter.com/oauth/access_token",
			"key" : [this.consumer_secret, token.oauth_token_secret],
			"type" : "HTTPheader"
		});
	header.add( ["oauth_consumer_key", this.consumer_key ] );
	header.add([ "oauth_token", token.oauth_token ]);
	header.add( ["oauth_verifier", pin] );
	
	var request = new air.URLRequest( "http://twitter.com/oauth/access_token" );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	
	request.requestHeaders = new Array( new air.URLRequestHeader( "Authorization", header.generate() ) );
	
	var loader = new air.URLLoader();
	var thisRef = this;
	loader.addEventListener( air.Event.COMPLETE, function ( event ) { thisRef.gotAccessToken( event ) } );
	loader.addEventListener( air.IOErrorEvent.IO_ERROR, function ( event ) { air.trace( event ) } );
	
	loader.load( request );
}

OAuth.prototype.gotAccessToken = function ( event )
{
	var token = parseUri( "http://blabla.com?"+event.target.data ).queryKey;
	
	this.accessCallback( token );
}