function ListBuilder( type, user )
{
	this.type = type;
	this.user = user;
	this.APIList = new PeopleList( type, this.user );
	this.DBList = new PeopleList( type, this.user );
	this.members = new PeopleList( type, this.user );
	this.APIpage = 0;
	this.dbIsRead = false;
	this.triedDiff = false;
	this.db = dataStorage.db;
}

ListBuilder.prototype.refresh = function ()
{
	this.readAPI( 1 );
	this.readDB();
}

ListBuilder.prototype.readAPI = function ( APIpage )
{
	this.APIpage = APIpage;
	
	var thisRef = this;

	if ( this.type == "followers" )
	{
		PAL.followers({
				"userId": this.user.id,
				"username": this.user.username,
				"page": APIpage,
				"checkedCallback": function ( event ) { thisRef.readedAPI( event ) },
				"errorCallback": function ( event ) { thisRef.errorReadingAPI( event ) }
			});
	}else if ( this.type == "following" )
	{
		PAL.following({
				"userId": this.user.id,
				"username": this.user.username,
				"page": APIpage,
				"checkedCallback": function ( event ) { thisRef.readedAPI( event ) },
				"errorCallback": function ( event ) { thisRef.errorReadingAPI( event ) }
			});
	}else if ( this.type == "blocked" )
	{
		PAL.blocked({
				"userId": this.user.id,
				"username": this.user.username,
				"page": APIpage,
				"checkedCallback": function ( event ) { thisRef.readedAPI( event ) },
				"errorCallback": function ( event ) { thisRef.errorReadingAPI( event ) }
			});
	}
}

ListBuilder.prototype.readedAPI = function ( event )
{
	var list = event.target.data;
	list = PAL.followersParse( list, this.user.id );

	if ( list.length > 0 )
	{
		this.appendAPIList( list );
		this.readAPI( this.APIpage+1 );
	}else
	{
		this.compareLists();
	}
}

ListBuilder.prototype.appendAPIList = function ( list )
{
	for ( var i in list )
	{
		this.APIList.add( list[ i ] );
	}
}

ListBuilder.prototype.errorReadingAPI = function ( event )
{
	notifier.showFootStatus( Language.def( this.type+"_error_read" ) );
}

ListBuilder.prototype.readDB = function ()
{
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = "SELECT id, nick FROM people WHERE user='"+this.user.id+"' AND type='"+this.type+"'";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.readedDB( event ) } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

ListBuilder.prototype.readedDB = function ( event )
{
	var list = event.target.getResult().data;
	
	if ( list == null )
	{
		this.dbIsRead = true;
		return;
	}
	
	for ( var i in list )
	{
		this.DBList.add( list[ i ][ "id" ], list[ i ][ "nick" ] );
		this.members.add( list[ i ][ "id" ], list[ i ][ "nick" ] );
	}
	
	this.dbIsRead = true;
}

ListBuilder.prototype.compareLists = function ()
{
	var thisRef = this;
	
	if ( !this.dbIsRead && !this.triedDiff )
	{ // this should help when reading the db is slower than the internet for some strange reason
		this.triedDiff = true;
		setTimeout( function () { thisRef.compareLists() }, 500 );
		return;
	}else if ( !this.dbIsRead )
	{
		notifier.showFootStatus( Language.def( this.type+"_error_new" ) );
		return;
	}
	
	if ( !this.APIList.allHaveData() )
	{ // when the graph isn't done forming
		setTimeout( function () { thisRef.compareLists() }, 2000 );
		return;
	}
	
	var newMembers = this.APIList.diff( this.DBList );
	var lostMembers = this.DBList.diff( this.APIList );
	
 	newMembers.storeToDB();
 	lostMembers.removeFromDB();
	
	this.sanitizeMembers( newMembers, lostMembers );
	
	this.announceNew( newMembers );
	this.announceLost( lostMembers );
}

ListBuilder.prototype.sanitizeMembers = function ( newMembers, lostMembers )
{
	this.members.appendList( newMembers );
	this.members.cutList( lostMembers );
}

ListBuilder.prototype.announceNew = function ( list )
{
	if ( this.type == "followers" )
	{
		notifier.announceNewFollowers( list, this.user.id );
	}else if ( this.type == "following" )
	{
		notifier.announceNewFollowing( list, this.user.id );
	}else if ( this.type == "blocked" )
	{
		notifier.announceNewBlocked( list, this.user.id );
	}
}

ListBuilder.prototype.announceLost = function ( list )
{
	if ( this.type == "followers" )
	{
		notifier.announceQwitters( list, this.user.id );
	}else if ( this.type == "following" )
	{
		notifier.announceUnfollowed( list, this.user.id );
	}else if ( this.type == "blocked" )
	{
			notifier.announceUnblocked( list, this.user.id );
	}
}

ListBuilder.prototype.add = function ( id )
{
	var newMember = new PeopleList( this.type, this.user );
	newMember.add( id );
	newMember.storeToDB();
	
	this.members.add( id );
}

ListBuilder.prototype.remove = function ( id )
{
	var lostMember = new PeopleList( this.type, this.user );
	lostMember.add( id );
	lostMember.removeFromDB();
	
	this.members.remove( id );
}