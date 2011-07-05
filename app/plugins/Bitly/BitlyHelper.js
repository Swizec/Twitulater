function BitlyHelper( params )
{
	this.uri = params.uri;
	this.callback = params.callback;
	this.sentParams = params;
}

BitlyHelper.prototype.shorten = function ()
{
	var login = this.getCredentials();
	
	var loader = new air.URLLoader();
	var request = new air.URLRequest( "http://api.bit.ly/shorten?version=2.0.1&longUrl="+encodeURI( this.uri ) +"&login="+login["nick"]+"&apiKey="+login["key"]+"&history=1");
	var variables = new air.URLVariables();

	request.data = variables;
	request.method = air.URLRequestMethod.GET;
	request.authenticate = true;

	var thisReference = this;
	loader.addEventListener( air.Event.COMPLETE, function (event) { thisReference.readAndReturnURI( event ) } );

	try
	{
		loader.load( request );
	}catch( e )
	{
	}
}

BitlyHelper.prototype.getCredentials = function ()
{
	var credentials = this.readCredentials();
	var user = twitulaterUser.activeUser();
	
	if ( typeof( credentials[ user.id ] ) == "undefined" )
	{
		var nick = prompt( Language.def( "bitly_nick" ), "" );
		var key = prompt( Language.def( "bitly_key" ), "" );
		
		credentials[ user.id ] = { "nick" : nick, "key" : key };
		
		this.writeCredentials( credentials );
	}
	
	return credentials[ user.id ];
}

BitlyHelper.prototype.readCredentials = function ()
{
	var store = air.File.applicationStorageDirectory.resolvePath( "bitlyCredentials.dat" );
	var stream = new air.FileStream();
	
	if ( store.exists )
	{
		stream.open( store, air.FileMode.READ );
		var credentials = stream.readObject();
		stream.close();
		
		return credentials;
	}
	
	return {};
}

BitlyHelper.prototype.writeCredentials = function ( credentials )
{
	var store = air.File.applicationStorageDirectory.resolvePath( "bitlyCredentials.dat" );
	var stream = new air.FileStream();
	
	stream.open( store, air.FileMode.WRITE );
	stream.writeObject( credentials );
	stream.close();
}


BitlyHelper.prototype.readAndReturnURI = function ( event )
{
	var uri = this.readURI( event );
	this.callback( uri, this.sentParams );
}

BitlyHelper.prototype.readURI = function ( event )
{
	var response = JSON.parse( event.target.data );

	if ( response.statusCode != "OK" )
	{
		if ( response.errorCode == 203 )
		{
			this.resetCredentials();
		}
		
		notifier.showStatus( response.errorMessage );
		return this.uri;
	}else
	{
		notifier.showStatus( Language.def( "bitly_shortened" )+this.uri );
		return response.results[ this.uri ][ "shortUrl" ];
	}
}

BitlyHelper.prototype.resetCredentials = function ()
{
	var credentials = this.getCredentials();
	var userId = twitulaterUser.activeUser().id;
	
	credentials[ userId ] = undefined;
	
	this.writeCredentials( credentials );
	
}