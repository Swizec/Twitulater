function USAL()
{
	this.callbackOnDone = false;
	this.callback = "";
}

USAL.prototype.shortenAndAddURI = function ()
{
	var uri = $("#dialog form input[name='url']").val();
	var service = $("#dialog form .service").val();
	$("#dialogWrapper").css( "display", "none" );

	if ( service == "" )
	{
		service = settings.defaultShortener();
	}

	notifier.showStatus( Language.def( "shortening" ).replace( /\(uri\)/, uri ) );

	var shortener = new pluginLoader.getPlugin( service ).getWorker( { "uri": uri, "callback": this.addURItoTweet } );
	shortener.shorten();
}

USAL.prototype.addURItoTweet = function ( shortUri )
{
	myTweet.add( " "+shortUri );
}

USAL.prototype.autoShortenURIs = function ( text )
{
	var parser = XRegExp.cache( "^http://[\p{L}0-9%\-~_.:&?*#@,]+$" );
	var words = text.split( /\p{Z}+/ );

	for ( var i = 0; i < words.length; i++ )
	{
		if ( words[ i ].match( parser ) && words[ i ].length > 25 )
		{
			this.shortenAndReplaceURI( words[ i ] );
		}
	}
}

USAL.prototype.shortenAndReplaceURI = function ( uri )
{
	notifier.showPermanentStatus( Language.def( "shortening" ).replace( /\(uri\)/, uri ) );

	var shortener = pluginLoader.getPlugin( settings.defaultShortener() ).getWorker({ "uri": uri, "callback": this.replaceURIinTweetAndMainCallback });
	shortener.shorten();
}

USAL.prototype.replaceURIinTweetAndMainCallback = function ( shortUri, sentParams )
{
	var text = myTweet.value();
	text = text.replace( sentParams.uri, shortUri );
	myTweet.value( text );

	USAL.mainCallback();
}

USAL.prototype.mainCallback = function ()
{
	if ( this.callbackOnDone )
	{
		if ( this.doneShorting() )
		{
			this.callbackOnDone = false;
			this.callback();
		}
	}
}

USAL.prototype.doneShorting = function ()
{
	var text = myTweet.value();
	var parser = XRegExp.cache( "^http://[\p{L}0-9%\-~_.:&?*#@,]+$" );
	var words = text.split( /\p{Z}+/ );

	for ( var i = 0; i < words.length; i++ )
	{
		if ( words[ i ].match( parser ) && words[ i ].length > 25 )
		{
			return false;
		}
	}

	return true;
}

USAL.prototype.shortenBeforePost = function ( callback )
{
	if ( !this.doneShorting() )
	{
		this.callback = callback;
		this.callbackOnDone = true;

		this.autoShortenURIs( myTweet.value() );

		return true;
	}

	return false;
}

USAL.prototype.showUrlForm = function()
{
	var dialog = new Dialog( "shortenURL" );
	dialog.setTitle( "Shorten URL" );
	dialog.onWindowInit( this.dialogInit );
	dialog.open();
}

USAL.prototype.dialogInit = function ()
{
	var shorteners = pluginLoader.getPlugins( "URIshortener" );
	for ( var i in shorteners )
	{
		$("#dialog .service ul").append( "<li val=\""+shorteners[i].identifier+"\">"+shorteners[i].displayName+"</li>" );
	}

	$("#dialog .submit").styledButton({
		"action" : function () { $("#dialog form").submit() },
		"orientation" : "right"
	});

	$("#dialog .service").styledButton({
		"dropdown" : true,
		"role" : "select",
		"orientation" : "left",
		"defaultValue" : settings.defaultShortener()
	});

	$("#dialog form").submit( function () { USAL.shortenAndAddURI(); return false } );
}