function TwitterAuthorisator()
{
}

TwitterAuthorisator.prototype.followers = function( params )
{
	var request = new air.URLRequest( "http://twitter.com/followers/ids.json?id="+params.username+"&page="+params.page );
	request.userAgent = "Twitulater";
	
	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, params.checkedCallback );
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, params.errorCallback );

	loader.load( request );
}

TwitterAuthorisator.prototype.following = function( params )
{
	var request = new air.URLRequest( "http://twitter.com/friends/ids.json?id="+params.username+"&page="+params.page );
	request.userAgent = "Twitulater";
	
	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, params.checkedCallback );
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, params.errorCallback );

	loader.load( request );
}

TwitterAuthorisator.prototype.blocked = function( params )
{
	var url = "http://twitter.com/blocks/blocking/ids.json";
	
	var variables = {}
	variables.id = params.username;
	variables.page = params.page;

	var request = new air.URLRequest( url );
	request.authenticate = false;
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( this.getAuthHeader( params.userId, "GET", url, variables ) );
	request.data = this.convertVariables( variables );
	
	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, params.checkedCallback );
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, params.errorCallback );

	loader.load( request );
}

TwitterAuthorisator.prototype.convertVariables = function ( variables )
{
	var urlvariables = new air.URLVariables();
	
	for ( var k in variables )
	{
		urlvariables[k] = variables[k];
	}

	return urlvariables;
}

TwitterAuthorisator.prototype.getAuthHeader = function ( user, method, uri, variables )
{
	var user = twitulaterUser.getUser( user );
	
	var header = new OAuthHeader({
			"method" : method,
			"uri" : uri,
			"key" : [OAuth.consumer_secret, user.token_secret],
			"type" : "HTTPheader"
		});
	header.add( ["oauth_consumer_key", OAuth.consumer_key ] );
	header.add( ["oauth_token", user.token] );
	for ( var k in variables )
	{
		header.add( [k, variables[k]] );
	}
	
	return new air.URLRequestHeader( "Authorization", header.generate() );
}