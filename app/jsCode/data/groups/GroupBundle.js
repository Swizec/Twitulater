function GroupBundle ( userId )
{
	this.userId = userId;
	this.groups = {};
	
	this.readDB();
}

GroupBundle.prototype.readDB = function ()
{
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;

	query.text = "SELECT rowid, * FROM groups WHERE user='"+this.userId+"' ORDER BY name ASC";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.fetchedGroups( event ) } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

GroupBundle.prototype.fetchedGroups = function ( event )
{
	var data = event.target.getResult().data;
	
	if ( data == null )
	{
		return;
	}
	
	for ( var i in data )
	{
		var group = new Group({
				"id" : data[ i ].rowid,
				"userId" : this.userId,
				"name" : data[ i ].name,
				"description" : data[ i ].description
			});
		this.add( group );
	}
}

GroupBundle.prototype.add = function ( group )
{
	this.groups[ group.id ] = group;
}

GroupBundle.prototype.getGroups = function ()
{
	var groups = new Array();
	
	for ( var id in this.groups )
	{
		groups.push( this.groups[ id ] );
	}
	
	return groups;
}

GroupBundle.prototype.getGroup = function ( id )
{
	if ( typeof( this.groups[ id ] ) == "undefined" )
	{
		this.groups[ id ] = new Group({
				"id" : id,
				"userId" : this.userId,
				"name" : "",
				"description" : ""
			});
	}
	
	return this.groups[ id ];
}

GroupBundle.prototype.inGroup = function ( personId )
{
	for ( var id in this.groups )
	{
		if ( this.groups[ id ].isMember( personId ) )
		{
			return true;
		}
	}
	
	return false;
}

GroupBundle.prototype.memberOfGroups = function ( personId )
{
	var groups = new Array();
	for ( var id in this.groups )
	{
		if ( this.groups[ id ].isMember( personId ) )
		{
			groups.push( this.groups[ id ].name );
		}
	}
	
	return groups;
}

GroupBundle.prototype.remove = function ( groupId )
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.text = "DELETE FROM group2person WHERE group_id='"+groupId+"'";
	query.execute();
	
	query.text = "DELETE FROM groups WHERE rowid='"+groupId+"'";
	query.execute();
	
	this.groups[ groupId ] = undefined;
}