function ContentRefresher()
{
	this.locked = {};
	this.currentlyReading = {};
	this.tweets = {};
	this.intervalSet = false;
	this.checkFollowersLock = false;
	this.checkFollowersIndex = 0;
	this.stopped = false;
}

ContentRefresher.prototype.refreshAndSetInterval = function ()
{
	var thisRef = this;
	
	this.dmRefresh();
	this.repliesRefresh();
	this.normalRefresh();
	this.searchRefresh();
	this.refreshSocialGraphs();

	if ( !this.intervalSet )
	{
		setInterval( function () { thisRef.normalRefresh() }, settings.regularInterval()*1000 );
		setInterval( function () { thisRef.searchRefresh() }, settings.searchInterval()*1000 );
		setInterval( function () { thisRef.repliesRefresh() }, settings.replyInterval()*1000 );
		setInterval( function () { thisRef.dmRefresh() }, settings.DMinterval()*1000 );
		setInterval( function () { thisRef.refreshSocialGraphs() }, 3600*1000 );

		this.intervalSet = true;
	}
}

ContentRefresher.prototype.normalRefresh = function ()
{
	var users = twitulaterUser.loggedInUsers();

	for ( var i = 0; i < users.length; i++ )
	{
		if ( this.shouldRefresh( users[ i ] ) )
		{
			PAL.normalRead( users[ i ] );
		}
	}
}

ContentRefresher.prototype.searchRefresh = function ()
{
	var users = twitulaterUser.loggedInUsers();

	for ( var i = 0; i < users.length; i++ )
	{
		if ( this.shouldRefresh( users[ i ] ) )
		{
			searches.refresh( users[ i ] );
		}
	}
}

ContentRefresher.prototype.repliesRefresh = function ()
{
	var users = twitulaterUser.loggedInUsers();
	
	for ( var i = 0; i < users.length; i++ )
	{
		if ( this.shouldRefresh( users[ i ] ) )
		{
			PAL.repliesRead( users[ i ] );
		}
	}
}

ContentRefresher.prototype.dmRefresh = function ()
{
	var users = twitulaterUser.loggedInUsers();
	
	for ( var i = 0; i < users.length; i++ )
	{
		if ( this.shouldRefresh( users[ i ] ) )
		{
			PAL.dmRead( users[ i ] );
		}
	}
}

ContentRefresher.prototype.manualRefresh = function ()
{
	this.dmRefresh();
	this.repliesRefresh();
	this.normalRefresh();
	this.searchRefresh();
}

ContentRefresher.prototype.refreshSocialGraphs = function ()
{
	var users = twitulaterUser.loggedInUsers();
	
	for ( var i in users )
	{
		if ( this.shouldRefresh( users[ i ] ) )
		{
			var graph = socialGraphs.getGraph( users[ i ] );
			graph.refresh();
		}
	}
}

ContentRefresher.prototype.shouldRefresh = function ( user )
{
	return twitulaterUser.isLoggedIn( user ) && !this.stopped;
}

ContentRefresher.prototype.displayAndStoreData = function ( user, data, feed )
{
	var tweets = services.parseData({
			"user" : user, 
			"data" : data, 
			"feed" : feed 
		});

	mainDisplay.showNewTweets( user, tweets );
}

ContentRefresher.prototype.saveXMLToFile = function ( xml )
{
	var file = air.File.documentsDirectory.resolvePath( "tweetout.xml");
	var fileStream = new air.FileStream();
	fileStream.open( file, air.FileMode.WRITE );
	fileStream.writeUTF( xml );
	fileStream.close();
}

ContentRefresher.prototype.stopRefreshing = function ()
{
	this.stopped = true;
}