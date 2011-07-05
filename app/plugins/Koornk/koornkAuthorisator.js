function KoornkAuthorisator()
{
}

KoornkAuthorisator.prototype.validate = function ( params )
{
	$("#loginForm .status").html( "Validating ..." );
	$("#status").html( "Authenticating ..." );

	var loader = new air.URLLoader();

	loader.addEventListener( air.IOErrorEvent.IO_ERROR, params.errorCallback );
	loader.addEventListener( air.Event.COMPLETE, params.validatedCallback );

	var authVars = new air.URLVariables();
	authVars.username = params.user.username;
	authVars.password = params.user.password;

	var request = new air.URLRequest( "http://www.koornk.com/api/verify/");
	request.userAgent = "Twitulater";
	request.method = air.URLRequestMethod.POST;
	request.data = authVars;

	loader.load( request );
}

KoornkAuthorisator.prototype.followers = function( params )
{
	params.errorCallback();
	return;

	var request = new air.URLRequest( "http://www.koornk.com/api/followers/?page="+params.page );
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( twitulaterUser.getAuthHeader( params.userId ) );

	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, params.checkedCallback );
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, params.errorCallback );

	loader.load( request );
}

KoornkAuthorisator.prototype.following = function( params )
{
	params.errorCallback();
	return;

	var request = new air.URLRequest( "http://www.koornk.com/api/following/?page="+params.page );
	request.userAgent = "Twitulater";
	request.requestHeaders = new Array( twitulaterUser.getAuthHeader( params.userId ) );

	var loader = new air.URLLoader();
	loader.addEventListener(air.Event.COMPLETE, params.checkedCallback );
	loader.addEventListener(air.IOErrorEvent.IO_ERROR, params.errorCallback );

	loader.load( request );
}

KoornkAuthorisator.prototype.blocked = function ( params )
{
	params.errorCallback();
}