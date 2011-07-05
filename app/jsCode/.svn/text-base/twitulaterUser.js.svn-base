function TwitulaterUser()
{
	this.authenticatedUsers = new Array();
	this.currentUsers = {};
	this.activatedUser = "";
	this.tempFollowers = {}
	this.authenticationIndex = -1;
	this.finishedStartup = false;
	this.usersToAuthenticate = new Array();
	this.loginForm = {};
}

TwitulaterUser.prototype.fetchOrSetLogin = function ()
{
	var users = dataStorage.fetchUsers();

	if ( users.length > 0 )
	{
		this.usersToAuthenticate = users;
		this.authenticateUsers();
	}else
	{
		$("#input").css( "opacity", "0.4" );
		$("#menu").css( "opacity", "0.4" );
	}
}

TwitulaterUser.prototype.authenticateUsers = function ()
{
	this.authenticationIndex = this.authenticationIndex+1;

	if ( this.authenticationIndex < this.usersToAuthenticate.length && !this.finishedStartup )
	{
		var i = this.authenticationIndex;
		var userData = new LoginObject( this.usersToAuthenticate[ i ] );
		
		if ( userData.token == "" || userData.token_secret == "" )
		{
			userData.authenticated = false;
			this.validate( userData, "loginForm" );
		}else
		{
			userData.authenticated = true;
			var thisRef = this;
			setTimeout( function () { thisRef.commitLogin( userData ) }, 2 );
//			this.commitLogin( userData );
		}
	}else
	{
		this.finishedStartup = true;
	}
}

TwitulaterUser.prototype.showLoginForm = function ( )
{
	var thisRef = this;
	$("#addUser #logins").accordion({
				collapsible: true,
				active: false,
				autoHeight: false,
				header: "a",
				icons: "",
				change: function ( event, ui )
						{
							var protocol = ui.newHeader.attr( "with" );
							
							if ( protocol == "twitter" )
							{
								thisRef.enableTwitterForm();
							}else if ( protocol == "koornk" )
							{
								thisRef.enableKoornkForm();
							}
						}
			});
			
	
	$("#addUser #forum")
			.html( '<div id="fdbk_container">' +
				feedback_widget.iframe_html + 
			'</div>' );
//			.hover( function () { $(this).animate( {"left" : 150 }, 300 ) },
//				function () { $(this).animate( {"left" : 400 }, 300 ) }
//			);
	$("#fdbk_tab").css( "display", "none" );
	feedback_widget.show();
	$("#fdbk_overlay").css( {"display": "none" } );
	$("#addUser #fdbk_container iframe").css( {"margin" : "0", "margin-top" : "-50px" } );
	$("#addUser #fdbk_container iframe.loading").css( {"margin" : "0", "margin-top" : "-50px" } );
	
}

TwitulaterUser.prototype.hideLoginForm = function ()
{
	$("#fdbk_tab").css( "display", "block" );
	$("#addUser #forum").html( "" );
	$("#addUser #logins").accordion( "destroy" );
	feedback_widget.hide();
}

TwitulaterUser.prototype.enableTwitterForm = function ()
{
	this.setupForm( "#addUser #twitter form" );
	$("#addUser #twitter input").val( "" );
	$("#addUser #twitter .spinner").css({ "display" : "block" });
	$("#addUser #twitter .pinInput").css({ "display" : "none" });
	
	var thisRef = this;
	$("#addUser #twitter #login").styledButton({
		"action" : function ( event ) { thisRef.loginForm.submit( event ) }
	});
	this.loginForm.method = "OAuth";
	this.loginForm.start();
}

TwitulaterUser.prototype.enableKoornkForm = function ()
{
	this.setupForm( "#addUser #koornk form" );
	
	$("#addUser #koornk .username,#addUser #koornk .password").val( "" );
	
	var thisRef = this;
	$("#addUser #koornk #login").styledButton({
		"action" : function () { thisRef.loginForm.submit() }
	});
}

TwitulaterUser.prototype.setupForm = function ( id )
{
	this.loginForm = new LoginForm( id );
}

TwitulaterUser.prototype.validate = function ( loginData, fromForm )
{
	PAL.validate({
			"user": loginData,
			"validatedCallback": function ( event ) { twitulaterUser.completeValidateHandler( event, loginData ) },
			"errorCallback": function ( event ) { twitulaterUser.validateError( event, fromForm ) }
		});
}

TwitulaterUser.prototype.addActiveUser = function ( loginData ) {
	this.currentUsers[ loginData.id ] = loginData;
}

TwitulaterUser.prototype.validateError = function ( event, formSelector )
{
	var loader = air.URLLoader(event.target);
	
	$(formSelector+" .status").html( "<strong>Couldn't login</strong>" );
	$(formSelector+" input.password").val( "" );
	this.showLoginForm( formSelector );
}

TwitulaterUser.prototype.completeValidateHandler = function ( event, loginData )
{
	this.commitLogin( loginData );
}

TwitulaterUser.prototype.commitLogin = function ( loginData )
{
	$("#status").html( "Authenticated");
	$("#input").css( "opacity", "1.0" );
	$("#menu").css( "opacity", "1.0" );

	loginData = this.storeLoginAndCompleteData( loginData );
	loginData.authenticated = true;

	this.authenticatedUsers.push( loginData.id );
	this.addActiveUser( loginData );
	
	this.initUser( loginData.id );

	this.authenticateUsers();
}

TwitulaterUser.prototype.storeLoginAndCompleteData = function ( loginData )
{
	var userId = dataStorage.storeUser( loginData );
	loginData.id = userId;

	return loginData;
}

TwitulaterUser.prototype.initUser = function( userId )
{
	searches.registerUser( userId );
//	searches.add({ 
//			"userId" : loginData.id, 
//			"term" : "@"+loginData.username, 
//			"type" : searches.USERNAME_SEARCH 
//		});
	Groups.initUser( userId );
	
	mainDisplay.setupNewTab( userId );
	dataStorage.fetchOldTweets( userId );
 	contentRefresher.refreshAndSetInterval();
}

TwitulaterUser.prototype.isLoggedIn = function ( user )
{
	var user = this.currentUsers[ user ];
	return user.username != "" && user.authenticated == true;
}

TwitulaterUser.prototype.loggedInUsers = function ()
{
	return this.authenticatedUsers;
}

TwitulaterUser.prototype.getUser = function ( user )
{
	return this.currentUsers[ user ];
}

TwitulaterUser.prototype.activeUser = function ()
{
	return this.getUser( this.activatedUser );
}

TwitulaterUser.prototype.newActiveUser = function ( user )
{
	this.activatedUser = user;
}

TwitulaterUser.prototype.currentUsersCount = function ()
{
	return this.authenticatedUsers.length;
}

TwitulaterUser.prototype.getAuthHeader = function ( user )
{
	if ( typeof( user ) == "undefined" )
	{
		var loginData = this.activeUser();
	}else if ( typeof( user ) == "object" )
	{
		var loginData = user;
	}else
	{
		var loginData = this.getUser( user );
	}

	return new air.URLRequestHeader( "Authorization", "Basic "+btoa( loginData.username+":"+loginData.password ) );
}

TwitulaterUser.prototype.logout = function ( userId )
{
	var user = this.getUser( userId );
	user.autologin = 0;
	user.authenticated = false;
	
	this.currentUsers[ userId ] = user;
	
	mainDisplay.removeTab( userId );
	
	dataStorage.storeUser( user );
}

function LoginObject( data )
{
	this.id = data[ "rowid" ];
	this.username = unescape( data[ "username" ] );
	this.password = ( typeof( data["password"] ) != "undefined" ) ? unescape( data[ "password" ] ) : "";
	this.protocol = unescape( data[ "protocol" ] );
	this.autologin = data[ "autologin" ];
	this.token = ( typeof( data["token"] ) != "undefined" ) ? unescape( data["token"] ) : "";
	this.token_secret = ( typeof( data["token_secret"] ) != "undefined" ) ? unescape( data["token_secret"] ) : "";
}