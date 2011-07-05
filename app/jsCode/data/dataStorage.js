function DataStorage()
{
	this.setupDB();
	this.lastFewTweetStore = {};
	this.lastTweetId = {};
	this.lastSearchTweetId = {};
	this.asyncStoring = false;
}

DataStorage.prototype.dbConnection = function ()
{
	return this.db;
}

DataStorage.prototype.setupDB = function ()
{
	this.db = new air.SQLConnection();

	var dbFile = air.File.applicationStorageDirectory.resolvePath( "twitulater_dbv10.3.db" );

	if (!dbFile.exists) {
		air.trace( "Creating new db" );
		var dbTemplate = air.File.applicationDirectory.resolvePath( "dataSchema.sqlite" );
		dbTemplate.copyTo( dbFile, true );
	}

	try
	{
		this.db.open( dbFile );
	}
	catch (error)
	{
		air.trace( "DB error:", error.message );
		air.trace( "Details:", error.details );
	}
}

DataStorage.prototype.addTweetToLastFew = function ( tweet )
{
	var user = tweet.toUser;

	if ( typeof( this.lastFewTweetStore[ user ] ) == "undefined" )
	{
		this.lastFewTweetStore[ user ] = new Array();
	}else if ( this.lastFewTweetStore[ user ].length >= 50 )
	{
		this.lastFewTweetStore[ user ].shift();
	}

	this.lastFewTweetStore[ user ].push( this.removeRTgarbage( tweet.text ) );

	this.newLastTweet( tweet );
}

DataStorage.prototype.newLastTweet = function ( tweet )
{
	if ( tweet.feed == "normal" )
	{
		if ( tweet.id > this.lastTweetId[ tweet.toUser ] )
		{
			this.lastTweetId[ tweet.toUser ] = tweet.id;
		}
	}else if ( tweet.feed == "search" )
	{
		if ( tweet.id > this.lastSearchTweetId[ tweet.toUser ] )
		{
			this.lastSearchTweetId[ tweet.toUser ] = tweet.id;
		}
	}
}

DataStorage.prototype.setSinceId = function ( tweet )
{
	var user = tweet.toUser;

	if ( typeof( this.lastTweetId[ user ] ) == "undefined" )
	{
		this.lastTweetId[ user ] = tweet.id;
	}else if ( this.lastTweetId[ user ] < tweet.id )
	{
		this.lastTweetId[ user ] = tweet.id;
	}
}

DataStorage.prototype.getSinceId = function ( user )
{
	if ( typeof( this.lastTweetId[ user ] ) == "undefined" )
	{
		this.lastTweetId[ user ] = this.getLastTweetId( user );
	}

	if ( this.lastTweetId[ user ] == 0 )
	{
		return 0;
	}

	return this.lastTweetId[ user ];
}

DataStorage.prototype.getLastTweetId = function ( user )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;

	query.text = "SELECT id FROM tweets WHERE user='"+user+"' ORDER BY id DESC LIMIT 1";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( error )
	{
		air.trace("Error fetching last id:", error);

		return 0;
	}

	result = query.getResult();

	if ( result.data == null )
	{
		return 0;
	}

	return result.data[ 0 ].id;
}

DataStorage.prototype.fetchOldTweets = function ( user )
{
	var thisRef = this;
	
	this.oldTweetQuery = new air.SQLStatement();
	this.oldTweetQuery.sqlConnection = this.db;

	this.oldTweetQuery.text = "SELECT p.id AS poster_id, p.name, p.nick, p.location, p.avatar, t.id, t.time, t.text, t.source, t.user, t.reply_to_id, t.reply_to_user "+
					"FROM tweets t, people_data p WHERE t.poster=p.id AND t.user='"+user+"' ORDER BY t.id DESC LIMIT 100";
	this.oldTweetQuery.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.fetchedOldTweets( event, user ) } );
	this.oldTweetQuery.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	this.oldTweetQuery.execute();
}

DataStorage.prototype.fetchedOldTweets = function ( event, user )
{
	var result = dataStorage.oldTweetQuery.getResult();

	if ( result.data != null )
	{
		var tweets = dataStorage.tweetResultToObjects( result.data );
		mainDisplay.showOldTweets( user, tweets );
	}

	delete( dataStorage.oldTweetQuery );
}

DataStorage.prototype.tweetResultToObjects = function ( result )
{
	var tweets = new Array();

	for ( var i in result )
	{
		var tmp = {};
		var data = result[ i ];

		tmp.id = data[ "id" ];
		tmp.created_at = data[ "time" ];
		tmp.text = unescape( data[ "text" ] );
		tmp.source = unescape( data[ "source" ] );
		tmp.toUser = unescape( data[ "user" ] );
		tmp.in_reply_to_status_id = data[ "reply_to_id" ];
		tmp.in_reply_to_screen_name = data[ "reply_to_user" ];
		tmp.user = {};
		tmp.user.id = data[ "poster_id" ];
		tmp.user.name = unescape( data[ "name" ] );
		tmp.user.screen_name  = unescape( data[ "nick" ] );
		tmp.user.location  = unescape( data[ "location" ] );
		tmp.user.description  = "";
		tmp.user.profile_image_url  = unescape( data[ "avatar" ] );
		tmp.user.followerCount  = 0;
		tmp.user.url = "";

		tweets.push( new Tweet( data[ "user" ], tmp, "normal" ) );
	}

	return tweets;
}

DataStorage.prototype.sqlErrorHandler = function ( event )
{
	air.trace( "Error with sql: "+event.toString() );
}

DataStorage.prototype.lastFewTweets = function ( user )
{
	if ( typeof( this.lastFewTweetStore[ user ] ) == "undefined" )
	{
		this.lastFewTweetStore[ user ] = new Array();
	}

	if ( this.lastFewTweetStore[ user ].length == 0 )
	{
		this.lastFewTweetRegen( user, 50 );
	}

	return this.lastFewTweetStore;
}

DataStorage.prototype.lastFewTweetRegen = function ( user, number )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;

	query.text = "SELECT text FROM tweets WHERE user='"+user+"' ORDER BY id DESC LIMIT "+number;
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( error )
	{
	}

	result = query.getResult();

	if ( result.data != null )
	{
		for ( i = 0; i < result.data.length; i++ )
		{
			text = unescape( result.data[ i ].text );
			if ( this.tweetIsRT( text ) )
			{
				text = this.removeRTgarbage( text );
			}
			this.lastFewTweetStore[ user ].push( text );
		}
		this.lastFewTweetStore[ user ].reverse();
	}
}

DataStorage.prototype.tweetIsRT = function ( text )
{
	return text.match( /^(rt|retweet|re-tweet|rp)(ing){0,1} .*/i );
}

DataStorage.prototype.removeRTgarbage = function ( text )
{
	var rtGarbage = new XRegExp.cache( "^((rt|retweet|re-tweet)(ing)* @[a-z]+[:]*)+", "i" );
	text = text.replace( rtGarbage, "" );
	text = text.substring( 1 );

	return text;
}

DataStorage.prototype.fetchUsers = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "SELECT rowid, * FROM users WHERE autologin='1' ORDER BY rowid ASC";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();

	result = query.getResult();

	if ( result.data == null )
	{
		return 0;
	}

	return result.data;
}

DataStorage.prototype.storeUser = function ( user )
{
	if ( user.id == "unknown" )
	{
		return this.insertUserIfNew( user );
	}else
	{
		return this.updateUser( user );
	}
}

DataStorage.prototype.insertUserIfNew = function ( user )
{
	if ( this.isNewUser( user ) )
	{
		return this.insertUser( user );
	}else
	{
		user.id = this.getRealUserId( user );
		return this.updateUser( user );
	}
}

DataStorage.prototype.isNewUser = function ( user )
{
	var query = new air.SQLStatement()
	query.sqlConnection = this.db;
	query.text = "SELECT rowid FROM users WHERE username='"+escape( user.username )+"' AND protocol='"+escape( user.protocol )+"' LIMIT 1";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();

	result = query.getResult();

	if ( result.data == null )
	{
		return true;
	}

	return false;
}

DataStorage.prototype.insertUser = function ( user )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "INSERT INTO users ( username, password, protocol, autologin, token, token_secret )VALUES( '"+escape( user.username )+"', '"+escape( user.password )+"', '"+escape( user.protocol )+"', '"+Number( user.autologin )+"', '"+escape( user.token )+"', '"+escape( user.token_secret )+"' )";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();

	return this.lastUserId();
}

DataStorage.prototype.lastUserId = function ( user )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "SELECT rowid FROM users ORDER BY rowid DESC LIMIT 1";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();

	result = query.getResult();

	if ( result.data == null )
	{
		return 0;
	}

	return result.data[ 0 ][ "rowid" ];
}

DataStorage.prototype.updateUser = function ( user )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "UPDATE users SET password = '"+escape( user.password )+"', autologin = '"+Number( user.autologin )+"' WHERE rowid='"+user.id+"'";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );
	
	query.execute();

	return user.id;
}

DataStorage.prototype.getRealUserId = function ( user )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "SELECT rowid FROM users WHERE username='"+escape( user.username )+"' AND protocol='"+escape( user.protocol )+"' LIMIT 1";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute()

	result = query.getResult();

	if ( result.data == null )
	{
		return 0;
	}

	return result.data[ 0 ][ "rowid" ];
}

function Follower( queryResult )
{
	this.id = queryResult[ "id" ];
	this.screen_name = queryResult[ "follower" ];
}