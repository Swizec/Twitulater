function TweetPoster( node, user )
{
	this.toUser = user;
	if ( typeof( node.description ) != "undefined" )
	{
		this.id = node.id;
		this.name = node.name;
		this.nick = node.screen_name;
		this.location = node.location;
		this.description = node.description;
		this.avatar = node.profile_image_url;
		this.followerCount = node.followers_count;
		this.website = node.url;
	}else
	{
		this.id = node.from_user_id;
		this.name = "";
		this.nick = node.from_user;
		this.location = "";
		this.description = "";
		this.avatar = node.profile_image_url;
		this.followerCount = "";
		this.website = "";
	}
	
	this.store();
}

TweetPoster.prototype.store = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "INSERT INTO people (id, user, nick, type)VALUES( '"+this.id+"', '"+this.toUser+"', '"+escape( this.nick )+"', 'seen' )";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
	}
	
	var user = twitulaterUser.getUser( this.toUser );
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "INSERT INTO people_data (id, protocol, name, nick, location, avatar)VALUES( '"+this.id+"', '"+user.protocol+"', '"+escape( this.name )+"', '"+escape( this.nick )+"', '"+escape( this.location )+"', '"+escape( this.avatar )+"' )";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{ // this happens when there's a key constraint error, so we update the info
		query.text = "UPDATE people_data SET name='"+escape( this.name )+"' AND location='"+escape( this.location )+"' AND avatar='"+escape( this.avatar )+"' WHERE id='"+this.id+"' AND protocol='"+user.protocol+"'";
		try
		{
			query.execute();
		}catch ( e )
		{
		}
	}
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "INSERT INTO people_emphasis (id, user, emphasis)VALUES( '"+this.id+"', '"+this.toUser+"', '0.0' )";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );
	try
	{
		query.execute();
	}catch ( e )
	{
	}
}