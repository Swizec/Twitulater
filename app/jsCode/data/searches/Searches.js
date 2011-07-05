function Searches ()
{
	this.bundles = {};
	
	this.HASHTAG_SEARCH = "hashtag";
	this.USERNAME_SEARCH = "username";
	this.MANUAL_SEARCH = "manual";
}

Searches.prototype.refresh = function ( userId )
{
	this.bundles[ userId ].refresh();
}

Searches.prototype.registerUser = function ( userId )
{
	this.bundles[ userId ] = new SearchBundle( userId );
	
	this.searchesFromDB( userId );
}

Searches.prototype.searchesFromDB = function ( userId )
{
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;

	query.text = "SELECT term, type FROM searches WHERE user="+userId+" ORDER BY term ASC";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.fetchedSearches( event, userId ) } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

Searches.prototype.fetchedSearches = function ( event, userId )
{
	var searches = event.target.getResult().data;
	
	if ( searches == null )
	{
		return;
	}
	
	for ( var i in searches )
	{
		this.add({ 
				"userId" : userId, 
				"term" : searches[ i ].term, 
				"type" : searches[ i ].type 
			});
	}
}

Searches.prototype.add = function ( params )
{
	if ( typeof( params.type ) == "undefined" )
	{
		params.type = this.HASHTAG_SEARCH;
	}
	
	this.bundles[ params.userId ].add( params.term, params.type, params.callback );
}

Searches.prototype.config = function ()
{
	var interface = new SearchesConfig( this.bundles );
	interface.open();
}
