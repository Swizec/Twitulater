function TwitterServicer()
{
}

TwitterServicer.prototype.usernameURI = function ( username )
{
	return "http://twitter.com/"+username;
}

TwitterServicer.prototype.replyToURI = function ( params )
{
	return "http://twitter.com/"+params.toUser+"/status/"+params.toId;
}

TwitterServicer.prototype.followersParse = function ( followers )
{
	return JSON.parse( followers );
}

TwitterServicer.prototype.finishedRetrieveStatus = function ( params )
{
	var stat = Language.def( "twitter_retrieved" );
	stat = stat.replace( /\(c\)/, params.count );
	stat = stat.replace( /\(t\)/, params.time );
	
	return stat;
}

TwitterServicer.prototype.finishedRetrieveGrowl = function ( params )
{
	var msg = "";
	if ( params.feed == "normal" )
	{
		msg = Language.def( "twitter_normal" );
	}else if ( params.feed == "replies" )
	{
		msg = Language.def( "twitter_replies" );
	}else if ( params.feed == "search" )
	{
		msg = Language.def( "twitter_search" );
	}else if ( params.feed == "dm" )
	{
		msg = Language.def( "twitter_dm" );
	}
	
	msg = msg.replace( /\(c\)/, params.count );
	msg = msg.replace( /\(u\)/, params.username );
	
	return msg;
}

TwitterServicer.prototype.fetchPerson = function ( params )
{
	var loader = new air.URLLoader();
	
	loader.addEventListener( air.IOErrorEvent.IO_ERROR, params.badCallback );
	loader.addEventListener( air.Event.COMPLETE, params.goodCallback );

	var request = new air.URLRequest( "http://twitter.com/users/show.json?id="+params.id );
	request.authenticate = false;

	loader.load( request );
}