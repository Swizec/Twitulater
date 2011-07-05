function MainDisplay( mainWindow )
{
	this.openPanes = {};
	this.windowIsBig = false;
	this.tweetQueue = new Array();
	this.tweetQueueIndex = 0;
	this.oldTweetQueue = new Array();
	this.asyncDisplaying = false;
	this.availablePanes = {}
	this.tabToUser = new Array( '' );
	this.displayedTweets = {};
	this.openMenus = {};
	this.mainWindow = mainWindow;
	this.openWindows = new Array();
	
	this.tabs = {};
}

MainDisplay.prototype.showNewTweets = function ( userId, tweetArray )
{
	tweetArray.sort( this.compareTweetsById );
	
	this.tabs[ userId ].addNewTweets( tweetArray );
}

MainDisplay.prototype.compareTweetsById = function ( a, b )
{
	if ( a.id == b.id )
	{
		return 0;
	}

	return ( a.id > b.id ) ? 1 : -1;
}

MainDisplay.prototype.showOldTweets = function ( userId, tweets )
{
	this.tabs[ userId ].addOldTweets( tweets );
}

MainDisplay.prototype.linkClickHandler = function ( event )
{
	var url = $(event.target).attr( "href" );
	var request = new air.URLRequest( url );

	try
	{
		air.navigateToURL( request );
	}catch ( e )
	{
		air.trace( e );
	}
	
	emphases.emphasize( $(this) );

	return false;
}

MainDisplay.prototype.tweetCommandClickHandler = function ( event, element )
{
	
	event.preventDefault();
	emphases.emphasize( element );
	PAL.tweetCommandClickHandler( element );
}

MainDisplay.prototype.initTweetMenus = function ( selector, displayWindow )
{
	if ( typeof( displayWindow ) == "undefined" )
	{
		var element = $(selector);
		$( selector+" a").css( "display", "none" );
	}else
	{
		var element = $(displayWindow.document).find( selector );
		$(displayWindow.document).find( selector+" a").css( "display", "none" );
	}
	
	var thisRef = this;

	element.hover(
			function () {
				thisRef.activateTweetMenu( $(this) );
				$(this).children().each( function () {
					if ( $(this).is("a" ) )
					{
						$(this).css( "display", "inline-block" );
					}
				})
			},
			function () {
				$(this).children().each( function () {
					if ( $(this).is("a" ) )
					{
						$(this).css( "display", "none" );
					}
				})
			});
}

MainDisplay.prototype.activateTweetMenu = function ( menu )
{
	menu.children().filter( "a.reply").styledButton({
		"action" : function ( event ) { mainDisplay.tweetCommandClickHandler( event, $(this) ) },
		"orientation" : "left",
		"allEqual" : true
	});
	menu.children().filter( "a.rt").styledButton({
		"action" : function ( event ) { mainDisplay.tweetCommandClickHandler( event, $(this) ) },
		"orientation" : "right",
		"allEqual" : true
	});
	menu.children().filter( "a.dm").styledButton({
		"action" : function ( event ) { mainDisplay.tweetCommandClickHandler( event, $(this) ) },
		"orientation" : "alone",
		"allEqual" : true
	});
}

MainDisplay.prototype.tweetingKeyPress = function ( event )
{
	if ( event.keyCode == 13 )
	{
		$("#myTweet").blur();
		PAL.tweet();
		return false;
	}

	USAL.autoShortenURIs( myTweet.value() );
	myTweet.refresh();
}

MainDisplay.prototype.isTweetQueueEmpty = function ()
{
	return this.tweetQueue.length == 0;
}

MainDisplay.prototype.setupNewTab = function ( userId )
{
	this.tabs[ userId ] = new Tab( userId );
	this.tabToUser.push( userId );
	$("#tabs").tabs( "select", this.makeTabId( userId ) );
}

MainDisplay.prototype.makeTabId = function ( user )
{
	return "tab_"+user;
}

MainDisplay.prototype.tabShown = function ( index )
{
	var newUser = this.tabToUser[ index ];
	
	if ( index == 0 )
	{
		twitulaterUser.showLoginForm();
	}else
	{
		twitulaterUser.hideLoginForm();
		this.tabs[ newUser ].shown();
	}

	twitulaterUser.newActiveUser( newUser );
}

MainDisplay.prototype.viewHeight = function ()
{
	return $(window).height()-$("#bottomBar").height()-$("#input").position().top-72;
}

MainDisplay.prototype.removeTab = function ( userId )
{
	var index = this.tabToUser.indexOf( userId );
	// this ordering very important, don't change
	$("#tabs").tabs( "remove", index );
	this.tabToUser.splice( index, 1 );
}

MainDisplay.prototype.mainWindowClosing = function ( event )
{
	event.preventDefault();
	
	var appCloser = new AppCloser( this.mainWindow, this.openWindows );
	appCloser.close();
}

MainDisplay.prototype.registerWindow = function ( window )
{
	this.openWindows.push( window );
}