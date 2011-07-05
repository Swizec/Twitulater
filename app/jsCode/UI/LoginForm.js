function LoginForm ( selector )
{
	this.selector = selector;
	this.method = "basic";
	
	var thisRef = this;
	$(this.selector).submit( function ( event ) { thisRef.submit( event ) } );
}

LoginForm.prototype.submit = function ( event )
{
	try
	{
		event.preventDefault()
	}catch ( e )
	{
	}
	
	if ( this.method == "basic" )
	{
		this.basicAuth();
	}else if ( this.method == "OAuth" )
	{
		this.OAuth();
	}
}

LoginForm.prototype.basicAuth = function ()
{
	var loginData = this.readInputs();
	
	for ( var k in loginData )
	{
		air.trace( k+"::"+loginData[k] );
	}

	twitulaterUser.validate( loginData, this.selector );
}

LoginForm.prototype.readInputs = function ()
{
	var username = $(this.selector+" .username").val();
	var password = $(this.selector+" .password").val();
	var autologin = Number( $(this.selector+" #remember").attr( "checked" ) );
	var protocol = $(this.selector+" .protocol").val();

	var tempData = { "username" : username, "password" : password, "protocol" : protocol, "rowid" : "unknown", "autologin" : autologin };

	var loginObject = new LoginObject( tempData );
	return loginObject;
}

LoginForm.prototype.start = function ()
{
	if ( this.method == "OAuth" )
	{
		var thisRef = this;
		OAuth.initialise( function ( token ) { thisRef.gotRequestToken( token ) } );
	}
}

LoginForm.prototype.gotRequestToken = function ( requestToken )
{
	this.requestToken = requestToken;
	$(this.selector+" .spinner").css({ "display" : "none" });
	$(this.selector+" .pinInput").css({ "display" : "block" });
}

LoginForm.prototype.OAuth = function ()
{
	var pin = $(this.selector+" .pin").val();
	
	var thisRef = this;
	OAuth.accessToken( pin, function ( data ) { thisRef.completeOAuthLogin( data ) }, this.requestToken );
}

LoginForm.prototype.completeOAuthLogin = function ( data )
{
	$(this.selector+" .spinner").css({ "display" : "block" });
	$(this.selector+" .pinInput").css({ "display" : "none" });
	
	var autologin = Number( $(this.selector+" #remember").attr( "checked" ) );
	
	var tempData = {
			"username" : data["screen_name"],
			"token" : data["oauth_token"],
			"token_secret" : data["oauth_token_secret"],
			"rowid" : "unknown",
			"autologin" : autologin,
			"protocol" : "Twitter"
		}
		
	var loginData = new LoginObject( tempData );
	
	twitulaterUser.commitLogin( loginData, this.selector );
}