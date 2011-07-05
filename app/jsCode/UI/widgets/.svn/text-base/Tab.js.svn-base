function Tab( userId )
{
	this.userId = userId;
	this.id = "tab_"+userId;
	this.panes = {};
	this.displayedTweets = {};
	this.asyncDisplaying = false;
	this.tweetQueue = new Array();
	this.paneMenu = {};
	
	this.initDisplay( userId );
}

Tab.prototype.initDisplay = function ( userId )
{
	var user = twitulaterUser.getUser( userId );
	
	var html = $("#protoTab").html();
	var icon = "<img src=\"looks/images/protocols/"+user.protocol.toLowerCase()+".png\" />&nbsp;&nbsp;";
	
	var html = "<div id=\""+this.id+"\" class=\"ui-tabs-hide\">"+html+"</div>";

	$("#tabs").append( html );
	
	$("#tabs").tabs( "add", "#"+this.id, icon+user.username+" (<span class=\""+this.id+"\">0</span>)<span class=\"logout_"+this.id+" logout\" title=\"Logout "+user.username+"\">X</span>" );
	$(".ui-tabs-nav").sortable({
		axis: "x",
		cancel: ".add",
		cursor: "move",
		containment: "parent"
	});
	$(".logout_"+this.id).styledButton({
			"action" : function ( event ) {
				twitulaterUser.logout( userId );
				event.stopPropagation();
			}
		}).css("display", "none");
		
	$("#"+this.id)
		.attr( "menuTabResizing", this.userId )
		.attr( "paneTabResizing", this.userId );
	$("#"+this.id+" #paneContainer" ).attr( "paneTabResizing", this.userId );

	var thisRef = this;
	this.paneMenu = new PaneMenu( this.id, function ( tweetType ) { thisRef.openPane( tweetType ) }, this.userId );
	this.initPanes();
}

Tab.prototype.initPanes = function ()
{
	var panes = [ "dm", "reply", "link", "question", "happy", "sad", "other", "rt", "my", "all", "spam" ];
	var thisRef = this;
	this.panes = {};
	
	for ( var i in panes )
	{
		var pane = panes[ i ]+"Tweets";
		
		this.panes[ pane ] = new Pane({
					"tabId" : this.id,
					"type" : pane,
					"displayName" : Language.def( "category_"+panes[ i ] ),
					"parent" : thisRef,
					"userId" : this.userId
				})
	}
}

Tab.prototype.shown = function ()
{
	this.paneMenu.refresh();
	
	for ( var type in this.panes )
	{
		var pane = this.panes[ type ];
		
		if ( pane.shown )
		{
			pane.refresh();
		}
	}
			
	$("."+this.id).html( "0" );
}

Tab.prototype.addNewTweets = function ( tweets )
{
	this.tweetQueue = this.tweetQueue.concat( tweets );

	if ( !this.asyncDisplaying )
	{
		this.asyncNewTweetDisplay();
	}
}

Tab.prototype.asyncNewTweetDisplay = function ()
{
	this.asyncDisplaying = true;
	var tweet = this.tweetQueue.shift();
	
	if ( typeof( tweet ) != "undefined" )
	{
		if ( this.shouldAddTweet( tweet ) )
		{
			notifier.addTweetToNotifyQueue( tweet );
			this.addTweet( tweet, "new" );
		}
		PAL.addTweetToConversations( tweet );
		
		var thisRef = this;
		setTimeout( function () { thisRef.asyncNewTweetDisplay() }, 1 );
	}else
	{
		this.tweetQueue = new Array();
		this.asyncDisplaying = false;
		
		notifier.showFootStatus( Language.def( "retrieve_done" ) );
		notifier.notifyFromTweetQueue();
		this.paneMenu.refresh();
	}
}

Tab.prototype.shouldAddTweet = function ( tweet )
{
	if ( typeof( this.displayedTweets[ tweet.id ] ) == "undefined" )
	{
		this.displayedTweets[ tweet.id ] = true;
		return true;
	}

	return false;
}

Tab.prototype.addTweet = function ( tweet, age )
{
	var tweetHTML = tweet.toHTML();
	var tweetType = tweet.getTweetType();

	if ( tweetType == "hashtagged" )
	{
		this.addHashTweet( tweet, tweetHTML, age );
	}else
	{
		if ( tweetType.match( "search" ) )
		{
			var searchTerm = tweetType.substring( tweetType.indexOf( "_" )+1 ).replace( "Tweets", "" );
			this.makeSurePaneExists( tweetType, "<strong>"+Language.def( "category_search" )+":</strong> "+searchTerm, "searches" );
		}
		
		this.panes[ tweetType ].addTweet( tweet, tweetHTML, age );
		this.increaseNumberOfFresh( tweetType, age );
	}
	if ( Groups.isGroupedTweet( tweet ) && tweet.feed != "dm" )
	{
		this.addGroupTweet( tweet, tweetHTML, age );
	}
	if ( tweet.feed != "dm" )
	{
		this.panes[ "allTweets" ].addTweet( tweet, tweetHTML, age );
	}

	tweet.activate( "#"+this.id+" #paneContainer " );
	dataStorage.addTweetToLastFew( tweet );
}

Tab.prototype.addHashTweet = function( tweet, tweetHTML, age )
{
	var tags = tweet.hashTags();

	for ( var i = 0; i < tags.length; i++ )
	{
		searches.add({ 
				"userId" : tweet.toUser, 
				"term" : tags[ i ] 
			});
		var tag = this.cleanupTag( tags[ i ] );
		var tweetType = "tag"+tag+"Tweets";

		this.makeSurePaneExists( tweetType, tags[ i ], "hashtag" );
		this.panes[ tweetType ].addTweet( tweet, tweetHTML, age );
		this.increaseNumberOfFresh( tweetType, age );
		hashTags.add( tag );
	}
}

Tab.prototype.cleanupTag = function ( tag )
{
	var cleanTag = new String( tag );
	cleanTag = cleanTag.substring( 1 );

	return cleanTag;
}

Tab.prototype.addGroupTweet = function ( tweet, tweetHTML, age )
{
	var groups = Groups.memberOfGroups( tweet );
	
	for ( var i in groups )
	{
		var group = groups[ i ];
		var tweetType = "group"+escape( group ).replace( /\%/g, "" )+"Tweets";
		
		this.makeSurePaneExists( tweetType, "<strong>"+Language.def( "groups_menu" )+": </strong>"+group, "groups" );
		this.panes[ tweetType ].addTweet( tweet, tweetHTML, age );
		this.increaseNumberOfFresh( tweetType, age );
	}
}

Tab.prototype.makeSurePaneExists = function ( tweetType, displayName, menuType )
{
	if ( typeof( this.panes[ tweetType ] ) != "undefined" )
	{
		return true;
	}

	var thisRef = this;
	this.panes[ tweetType ] =  new Pane({
					"tabId" : this.id,
					"type" : tweetType,
					"displayName" : displayName,
					"parent" : thisRef,
					"userId" : this.userId
				})
	
	var menuType = ( typeof( menuType ) == "undefined" ) ? "hashtag" : menuType;
	
	this.paneMenu.addItem( tweetType, displayName, menuType );
}

Tab.prototype.increaseNumberOfFresh = function ( tweetType, age )
{
	if ( age == "new" )
	{
		this.changeCaptionFreshNumber( 1 );
		this.changeGeneralFreshNumber( tweetType, 1 );
	}
}

Tab.prototype.changeCaptionFreshNumber = function ( delta )
{
	var number = $("."+this.id).html();
	number = parseInt( number );
	number = number+delta;
	if ( number < 0 )
	{
		number = 0;
	}

	$("."+this.id).html( number );
}

Tab.prototype.changeGeneralFreshNumber = function ( tweetType, delta )
{
	var number = $("#"+this.id+" ."+tweetType+"Count").html();
	number = parseInt( number );
	number = number+1;

	$("#"+this.id+" ."+tweetType+"Count").html( number );
}

Tab.prototype.resetFreshCount = function ( tweetPane )
{
	this.changeCaptionFreshNumber( -Number( $("#"+this.id+" ."+tweetPane+"Count").html() ) );
	$("#"+this.id+" ."+tweetPane+"Count").html( "0" );
}

Tab.prototype.addOldTweets = function ( tweets )
{
	this.oldTweetQueue = tweets;
	this.asyncShowOldTweets();
}

Tab.prototype.asyncShowOldTweets = function ()
{
	var tweet = this.oldTweetQueue.shift();

	if ( typeof( tweet ) != "undefined" )
	{
		this.addTweet( tweet, "old" );
		PAL.addTweetToConversations( tweet );

		var thisRef = this;
		setTimeout( function () { thisRef.asyncShowOldTweets() }, 1 );
	}else
	{
		this.paneMenu.refresh();
	}
}

Tab.prototype.openPane = function ( tweetPane )
{
	var pane = this.panes[ tweetPane ];
	
	if ( pane.shown )
	{
		pane.close();
	}
	
	pane.open();

	this.resetFreshCount( tweetPane );
}