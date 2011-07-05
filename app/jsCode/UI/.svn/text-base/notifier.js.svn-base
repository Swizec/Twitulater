function Notifier()
{
	this.busyMode = false;
	this.registeredGrowl = false;
	this.tweetNotifyQueue = {};
}

Notifier.prototype.register = function ()
{
	if ( this.registeredGrowl )
	{
		return;
	}
	this.registeredGrowl = true;
	
	var application = new Growl.Application();
	application.name = "Twitulater";
	application.icon = "http://twitulater.com/icon.png";
	
	var notificationTypes = this.setupNotificationTypes();
	
	Growl.register(application, notificationTypes);
}

Notifier.prototype.setupNotificationTypes = function ()
{
	var notificationTypes = new Array();
	
	var nt1 = new Growl.NotificationType();
	nt1.name = "newMessages";
	nt1.displayName = "New Messages";
	nt1.enabled = true;
	notificationTypes.push(nt1);
	
	var nt2 = new Growl.NotificationType();
	nt2.name = "newReplies";
	nt2.displayName = "New Replies";
	nt2.enabled = true;
	notificationTypes.push(nt2);
	
	var nt3 = new Growl.NotificationType();
	nt3.name = "search";
	nt3.displayName = "New Search Items";
	nt3.enabled = true;
	notificationTypes.push(nt3);
	
	var nt4 = new Growl.NotificationType();
	nt4.name = "newDMs";
	nt4.displayName = "New Direct Messages";
	nt4.enabled = true;
	notificationTypes.push(nt4);
	
	var nt5 = new Growl.NotificationType();
	nt5.name = "newFollowers";
	nt5.displayName = "New Followers";
	nt5.enabled = true;
	notificationTypes.push(nt5);
	
	var nt6 = new Growl.NotificationType();
	nt6.name = "lostFollowers";
	nt6.displayName = "Lost Followers";
	nt6.enabled = true;
	notificationTypes.push(nt6);
	
	var nt7 = new Growl.NotificationType();
	nt7.name = "lostFollowing";
	nt7.displayName = "Unfollowed";
	nt7.enabled = true;
	notificationTypes.push(nt7);
	
	var nt8 = new Growl.NotificationType();
	nt8.name = "newFollowing";
	nt8.displayName = "Following New";
	nt8.enabled = true;
	notificationTypes.push(nt8);
	
	var nt9 = new Growl.NotificationType();
	nt9.name = "lostBlocked";
	nt9.displayName = "Unblocked";
	nt9.enabled = true;
	notificationTypes.push(nt9);
	
	var nt9 = new Growl.NotificationType();
	nt9.name = "newBlocked";
	nt9.displayName = "Blocked";
	nt9.enabled = true;
	notificationTypes.push(nt9);
	
	
	return notificationTypes;
}

Notifier.prototype.announceNewFollowers = function ( followers, user )
{
	this.announceFollowChange( followers, user, "followers_new" );
}

Notifier.prototype.announceQwitters = function ( qwitters, user )
{
	this.announceFollowChange( qwitters, user, "followers_lost" );
}

Notifier.prototype.announceNewFollowing = function ( following, user )
{
	this.announceFollowChange( following, user, "following_new" );
}

Notifier.prototype.announceUnfollowed = function ( unfollowed, user )
{
	this.announceFollowChange( unfollowed, user, "following_lost" );
}

Notifier.prototype.announceNewBlocked = function ( blocked, user )
{
	this.announceFollowChange( blocked, user, "blocked_new" );
}

Notifier.prototype.announceUnblocked = function ( unblocked, user )
{
	this.announceFollowChange( unblocked, user, "blocked_lost" );
}

Notifier.prototype.announceFollowChange = function ( list, user, type )
{
	if ( list.length == 0 )
	{
		return;
	}
	
	var text = Language.def( type ).replace( /\(c\)/, list.length )+list.nameList();
	
	this.announceWithTweet( text, user );
	this.growlFollowChange( list, user, type );
}

Notifier.prototype.growlFollowChange = function ( list, user, type )
{
	var notifyType = "";
	
	if ( type == "followers_new" )
	{
		notifyType = "newFollowers";
	}else if ( type == "followers_lost" )
	{
		notifyType = "lostFollowers";
	}else if ( type == "following_new" )
	{
		notifyType = "newFollowing";
	}else if ( type == "following_lost" )
	{
		notifyType = "lostFollowing";
	}else if ( type == "blockeD_new" )
	{
		notifyType = "newBlocked";
	}else if ( type == "blocked_lost" )
	{
		notifyType = "lostBlocked";
	}
	
	var user = twitulaterUser.getUser( user );
	var message = Language.def( type+"_notification" ).replace( /\(u\)/, user.username ).replace( /\(c\)/, list.length ).replace( /\(p\)/, user.protocol );
	
	var notification = new Growl.Notification();
	notification.name = notifyType;
	notification.title = Language.def( "notification_"+notifyType );
	notification.text = message;

	this.growl( notification );
}

Notifier.prototype.announceWithTweet = function ( text, user )
{
	text = text+" #annc";
	var tweet = this.createTweet( text, user );
	tweet.type = "dmTweets";

	mainDisplay.showNewTweets( user, new Array( tweet ) );
}

Notifier.prototype.createTweet = function ( text, user )
{
	var tmp = {};

	tmp.id = this.fetch_unix_timestamp()+Math.floor(Math.random()*2);
	tmp.created_at = this.fetch_unix_timestamp();
	tmp.text = text;
	tmp.source = "Twitulater notifier";
	tmp.toUser = user;
	tmp.in_reply_to_status_id = "";
	tmp.in_reply_to_screen_name = "";
	tmp.sender = {};
	tmp.sender.id = "";
	tmp.sender.name = "Twitulater";
	tmp.sender.screen_name  = "twitulaterApp";
	tmp.sender.location  = "";
	tmp.sender.description  = "";
	tmp.sender.profile_image_url  = "http://twitter.com/account/profile_image/twitulaterApp";
	tmp.sender.followerCount  = 0;
	tmp.sender.url = "";

	return new Tweet( user, tmp, "dm" );
}

Notifier.prototype.fetch_unix_timestamp = function()
{
	return parseInt(new Date().getTime().toString().substring(0, 10))
}

Notifier.prototype.showPermanentStatus = function ( status )
{
	$("#tweetStatus")
		.stop( true )
		.css( "opacity", "1.0" )
		.html( status );
}

Notifier.prototype.showStatus = function ( status )
{
	$("#tweetStatus")
		.stop( true, true )
		.css( "opacity", "1.0" )
		.html( status )
		.animate({ opacity: 0.0 }, 3000 );
}

Notifier.prototype.showFootStatus = function ( status )
{
	$("#status").html( status );
}

Notifier.prototype.retrievedTweetsStatus = function ( tweetArray, user, feed )
{
	var today = new Date();
	var time = this.leadingZero( today.getHours() )+":"+this.leadingZero( today.getMinutes() )+":"+this.leadingZero( today.getSeconds() );

	var params = { "count": tweetArray.length, "time": time, "feed" : feed };
	var msg = PAL.finishedRetrieveStatus( params, user );
	var growlMsg = PAL.finishedRetrieveGrowl( params, user );
	
	var notification = new Growl.Notification();
	notification = this.setNotificationTitle( notification, feed );
	notification.text = growlMsg;

	this.showFootStatus( msg );

	if ( tweetArray.length > 0 )
	{
		this.growl( notification );
	}
}

Notifier.prototype.setNotificationTitle = function ( notification, feed )
{
	if ( feed == "normal" )
	{
		notification.name = "newMessages";
		notification.title = Language.def( "notification_newMessages" );
	}else if ( feed == "replies" )
	{
		notification.name = "newReplies";
		notification.title = Language.def( "notification_newReplies" );
	}else if ( feed == "search" )
	{
		notification.name = "search";
		notification.title = Language.def( "notification_search" );
	}else if ( feed == "dm" )
	{
		notification.name = "newDMs";
		notification.title = Language.def( "notification_newDMs" );
	}
	
	return notification;
}

Notifier.prototype.leadingZero = function ( number )
{
	if ( number < 10 )
	{
		number = "0"+number;
	}

	return number;
}

Notifier.prototype.growl = function ( notification )
{
 	this.register();
	if ( !this.busyMode )
	{
		try
		{
			Growl.notify( "Twitulater", notification );
		}catch ( e )
		{
		}
	}
}

Notifier.prototype.getFlexInterface = function ()
{
	return document["TwitulaterGrowler"];
}

Notifier.prototype.toggleBusyMode = function ()
{
	if ( this.busyMode )
	{
		this.busyMode = false;
	}else
	{
		this.busyMode = true;
	}
}

Notifier.prototype.addTweetToNotifyQueue = function ( tweet )
{
	if ( typeof( this.tweetNotifyQueue[ tweet.feed ] ) == "undefined" )
	{
		this.tweetNotifyQueue[ tweet.feed ] = {};
	}
	if ( typeof( this.tweetNotifyQueue[ tweet.feed ][ tweet.toUser ] ) == "undefined" )
	{
		this.tweetNotifyQueue[ tweet.feed ][ tweet.toUser ] = new Array();
	}
	
	this.tweetNotifyQueue[ tweet.feed ][ tweet.toUser ].push( tweet );
}

Notifier.prototype.notifyFromTweetQueue = function ()
{
	for ( var feed in this.tweetNotifyQueue )
	{
		for ( var user in this.tweetNotifyQueue[ feed ] )
		{
			this.retrievedTweetsStatus( this.tweetNotifyQueue[ feed ][ user ], user, feed );
		}
	}
	
	this.tweetNotifyQueue = {};
}