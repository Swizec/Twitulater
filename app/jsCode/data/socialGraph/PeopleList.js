function PeopleList( type, user )
{
	this.user = user;
	this.type = type;
	this.length = 0;
	this.nodes = {};
}

PeopleList.prototype.add = function ( id, nick )
{
	if ( typeof( id ) == "object" )
	{
		this.nodes[ id.id ] = id;
	}else
	{
		this.nodes[ id ] = new PeopleListNode({ 
					"id" : id, 
					"nick" : ( typeof( nick ) != "undefined" ) ? nick : "",
					"type" : this.type, 
					"user" : this.user 
				});
	}
	
	this.length += 1;
}

PeopleList.prototype.remove = function ( id )
{
	delete( this.nodes[ id ] );
	length -= 1;
}

PeopleList.prototype.hash = function ()
{
	return nodes;
}

PeopleList.prototype.got = function ( id )
{
	return ( typeof( this.nodes[ id ] ) != "undefined" );
}

PeopleList.prototype.diff = function ( set )
{
	var diff = new PeopleList( this.type, this.user );
	
	for ( var id in this.nodes )
	{
		if ( !set.got( id ) )
		{
			diff.add( this.nodes[ id ] );
		}
	}
	
	return diff;
}

PeopleList.prototype.list = function ()
{
	for ( var id in this.nodes )
	{
		air.trace( id );
	}
}

PeopleList.prototype.nameList = function ()
{
	var text = "";
	
	for ( var id in this.nodes )
	{
		var nick = (this.nodes[ id ].nick == "" ) ? "&lt;"+Language.def( "default_nick" )+"&gt;" : unescape( this.nodes[ id ].nick );
		if ( nick =="&lt;user_suspended&gt;" )
		{
			nick = "&lt;"+Language.def( "user_suspended" )+"&gt;";
		}
		text += "@"+nick+" ";
	}
	
	return text;
}

PeopleList.prototype.storeToDB = function ()
{
	for ( var id in this.nodes )
	{
		this.nodes[ id ].store();
	}
}

PeopleList.prototype.removeFromDB = function ()
{
	for ( var id in this.nodes )
	{
		this.nodes[ id ].remove();
	}
}

PeopleList.prototype.allHaveData = function ()
{
	var all = 0;
	var haveData = 0;
	
	for ( var id in this.nodes )
	{
		all += 1;
		if ( this.nodes[ id ].haveData )
		{
			haveData += 1;
		}
	}
	
	return ( all == haveData );
}

PeopleList.prototype.appendList = function ( list )
{
	for ( var id in list.nodes )
	{
		this.add( list.nodes[ id ] );
	}
}

PeopleList.prototype.cutList = function ( list )
{
	for ( var id in list.nodes )
	{
		this.remove( id );
	}
}