function KoornkServicer()
{
}

KoornkServicer.prototype.usernameURI = function ( username )
{
	return "http://koornk.com/user/"+username;
}

KoornkServicer.prototype.replyToURI = function ( params )
{
	return "http://koornk.com/status/"+params.toId;
}

KoornkServicer.prototype.followersParse = function ( followers )
{
	followers = JSON.parse( followers );
	var twitterified = new Array();

	for ( var i = 0; i < followers.count; i++ )
	{
		twitterified.push( { "id": 0, "screen_name": followers.list[ i ].user_login } );
	}

	return twitterified;
}

KoornkServicer.prototype.finishedRetrieveStatus = function ( params )
{
	var stat = Language.def( "koornk_retrieved" );
	stat = stat.replace( /\(c\)/, params.count );
	stat = stat.replace( /\(t\)/, params.time );
	
	return stat;
}

KoornkServicer.prototype.finishedRetrieveGrowl = function ( params )
{
	var msg = "";
	if ( params.feed == "normal" )
	{
		msg = Language.def( "koornk_normal" );
	}else if ( params.feed == "replies" )
	{
		msg = Language.def( "koornk_replies" );
	}else if ( params.feed == "search" )
	{
		msg = Language.def( "koornk_search" );
	}else if ( params.feed == "dm" )
	{
		msg = Language.def( "koornk_dm" );
	}
	
	msg = msg.replace( /\(c\)/, params.count );
	msg = msg.replace( /\(u\)/, params.username );
	
	return msg;
}

KoornkServicer.prototype.fetchPerson = function ( params )
{
// 	var loader = new air.URLLoader();
// 	
// 	loader.addEventListener( air.IOErrorEvent.IO_ERROR, params.badCallback );
// 	loader.addEventListener( air.Event.COMPLETE, params.goodCallback );
// 
// 	var request = new air.URLRequest( "https://twitter.com/users/show.json?id="+params.id );
// 	request.authenticate = false;
// 
// 	loader.load( request );
}