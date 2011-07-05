function Emphases( db )
{
	this.db = db;
	this.emphases = {};
	this.changedScores = {};
}

Emphases.prototype.init = function ( )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "SELECT id, user, emphasis FROM people_emphasis ORDER BY user";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();

	var result = query.getResult();
	
	if ( result.data == null )
	{
		return {};
	}
	
	for ( var i in result.data )
	{
		var row = result.data[ i ];
		var user = row[ "user" ];
		
		if ( typeof( this.emphases[ user ] ) == "undefined" )
		{
			this.emphases[ user ] = {};
		}
		
		this.emphases[ user ][ row[ "id" ] ] = row[ "emphasis" ];
	}
}

Emphases.prototype.getScore = function ( id, user )
{
	this.initScore( id, user );
	
	return this.emphases[ user ][ id ];
}

Emphases.prototype.initScore = function ( id, user )
{
	if ( typeof( this.emphases[ user ] ) == "undefined" )
	{
		this.emphases[ user ] = {};
	}
	if ( typeof( this.emphases[ user ][ id ] ) == "undefined" )
	{
		this.emphases[ user ][ id ] = 0;
	}
}

Emphases.prototype.emphasize = function ( element )
{
	var user = twitulaterUser.activeUser().id;
	var type = element.attr( "type" );
	var id = element.attr( "pid" );
	var delta = 0;
	
	this.initScore( id, user );

	switch ( type )
	{
		case "reply":
			delta = 0.02;
			break;
		case "rt":
			delta = 0.03;
			break;
		case "dm":
			delta = 0.05;
			break;
		case "linkClick":
			delta = 0.03;
			break;
	}
	
	this.emphases[ user ][ id ] = this.emphases[ user ][ id ]+delta;
	
	this.storeValue( user, id );
}

Emphases.prototype.storeValue = function ( user, id )
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "UPDATE people_emphasis SET emphasis="+this.emphases[ user ][ id ]+" WHERE id='"+id+"' AND user='"+user+"'";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
	}
	
	var result = query.getResult();
}