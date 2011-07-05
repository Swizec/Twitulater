function PeopleListNode( params )
{
	this.id = params.id;
	this.nick = params.nick;
	this.type = params.type;
	this.user = params.user;
	this.data = null;
	this.haveData = false;
	this.db = dataStorage.db;

	this.checkAndReadData();
}

PeopleListNode.prototype.checkAndReadData = function ()
{
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "SELECT * FROM people_data WHERE id='"+this.id+"' AND protocol='"+this.user.protocol+"' LIMIT 1";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.checkedDB( event ) } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

PeopleListNode.prototype.checkedDB = function ( event )
{
	var data = event.target.getResult().data;
	
	if ( data == null )
	{
		this.readData();
	}else
	{
		this.nick = data[ 0 ][ "nick" ];
		this.data = {
			"screen_name" : data[ 0 ][ "nick" ],
			"name" : data[ 0 ][ "name" ],
			"location" : data[ 0 ][ "location" ],
			"profile_image_url" : data[ 0 ][ "avatar" ],
		};
		this.haveData = true;
	}
}

PeopleListNode.prototype.readData = function ()
{
	var thisRef = this;
	PAL.fetchPerson({
			"userId" : this.user.id,
			"id" : this.id,
			"goodCallback" : function ( event ) { thisRef.readedData( event ) },
			"badCallback" : function ( event ) { thisRef.failReadingData( event ) }
		});
}

PeopleListNode.prototype.readedData = function ( event )
{
	var jsonString = event.target.data;
	var data = JSON.parse( jsonString );
	
	this.nick = data.screen_name;
	this.data = this.sanitizeData( data );
	
	this.haveData = true;
	
	this.storeData();
}

PeopleListNode.prototype.sanitizeData = function ( data )
{
	data.name = ( typeof( data.name ) != "undefined" ) ? data.name : "";
	data.location = ( typeof( data.location ) != "undefined" ) ? data.location : "";
	data.profile_image_url = ( typeof( data.profile_image_url ) != "undefined" ) ? data.profile_image_url : "";
	
	return data;
}

PeopleListNode.prototype.failReadingData = function ( event )
{
	try
	{
		var info = JSON.parse( event.target.data );
		if ( info.error == "User has been suspended." )
		{
			this.nick = "&lt;user_suspended&gt;";
			this.data = {
				"screen_name" : "&lt;user_suspended&gt;",
				"name" : "",
				"location" : "",
				"profile_image_url" : ""
			};
			
			this.storeData();
		}
	}catch ( e )
	{
	}
	
	this.haveData = true;
}

PeopleListNode.prototype.store = function ()
{
	this.storePerson();
	this.storeEmphasis();
}

PeopleListNode.prototype.storePerson = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "INSERT INTO people (id, user, nick, type)VALUES( '"+this.id+"', '"+this.user.id+"', '"+escape( this.nick )+"', '"+this.type+"' )";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
	}
}

PeopleListNode.prototype.storeEmphasis = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "INSERT INTO people_emphasis (id, user, emphasis)VALUES( '"+this.id+"', '"+this.user.id+"', '0.0' )";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
	}
}

PeopleListNode.prototype.storeData = function ()
{
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	
	if ( this.data != null )
	{
		query.text = "INSERT INTO people_data (id, protocol, name, nick, location, avatar)VALUES( '"+this.id+"', '"+this.user.protocol+"', '"+escape( this.data.name )+"', '"+escape( this.data.screen_name )+"', '"+escape( this.data.location )+"', '"+escape( this.data.profile_image_url )+"' )";
	}else
	{
		query.text = "INSERT INTO people_data (id, protocol, name, nick, location, avatar)VALUES( '"+this.id+"', '"+this.user.protocol+"', '', '', '', '' )";
	}
	
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
	}
}

PeopleListNode.prototype.remove = function ()
{
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "DELETE FROM people WHERE id='"+this.id+"' AND user='"+this.user.id+"' AND type='"+this.type+"'";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}