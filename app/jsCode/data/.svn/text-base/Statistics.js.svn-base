function Statistics()
{
	this.timeStarted = new Date().getTime()/1000;
	this.tweetCount = 0;
}

Statistics.prototype.register = function ()
{
	var loader = new air.URLLoader();

	loader.addEventListener( air.Event.COMPLETE, this.completed );
	loader.addEventListener( air.IOErrorEvent.IO_ERROR, this.error );
	
	var request = new air.URLRequest("http://stats.twitulater.com/StatServer.py?api_key=cJdV72hJGIKXWtyoovR5fIvsXM3E"+this.userIdURL() );
	request.userAgent = "Twitulater";
	
	loader.load( request );
}

Statistics.prototype.completed = function ( event )
{
	statistics.writeUserId( event.target.data );
}

Statistics.prototype.error = function ( event )
{
	air.trace( event );
}

Statistics.prototype.userIdURL = function ()
{
	var id = this.readUserId();
	
	return ( id != "" ) ? "&id="+id : "";
}

Statistics.prototype.readUserId = function ()
{
	var store = air.File.applicationStorageDirectory.resolvePath( "userid.dat" );
	var stream = new air.FileStream();
	
	if ( store.exists )
	{
		stream.open( store, air.FileMode.READ );
		var user = stream.readObject();
		stream.close();
		
		return user.id;
	}
	
	return "";
}

Statistics.prototype.writeUserId = function ( userId )
{
	var user = {};
	user.id = userId;
	
	var store = air.File.applicationStorageDirectory.resolvePath( "userid.dat" );
	var stream = new air.FileStream();
	
	stream.open( store, air.FileMode.WRITE );
	stream.writeObject( user );
	stream.close();
}

Statistics.prototype.reportData = function ( callback )
{
	this.collectData( callback );
}

Statistics.prototype.collectData = function ( callback )
{
	var thisRef = this;
	var query = new air.SQLStatement();
	
	query.sqlConnection = dataStorage.db;
	query.text = "SELECT (SELECT COUNT(*) FROM people WHERE type='following') AS following, "+
			"(SELECT COUNT(*) FROM people WHERE type='followers') AS followers, "+
			"(SELECT COUNT(*) FROM searches) AS searches, "+
			"(SELECT COUNT(*) FROM groups) as groups";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.collectedData( event, callback ) } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );
	
	query.execute();
}

Statistics.prototype.collectedData = function ( event, callback )
{
	dbData = event.target.getResult().data;
	
	var data = new air.URLVariables();
	data.id = this.readUserId();
	data.uptime = this.uptime();
	data.tweets = this.tweetCount;
	data.followers = dbData[0][ "followers" ];
	data.following = dbData[0][ "following" ];
	data.searches = dbData[0][ "searches" ];
	data.groups = dbData[0][ "groups" ];
	data.language = settings.language();
	data.accounts = this.activeAccounts();
	data.version = this.getApplicationVersion();
	
	this.sendData( data, callback );
}

Statistics.prototype.activeAccounts = function ()
{
	var users = twitulaterUser.loggedInUsers();
	var accounts = new Array()
	
	for ( var i in users )
	{
		accounts.push( twitulaterUser.getUser( users[ i ] ).username );
	}
	
	return accounts.join(",");
}

Statistics.prototype.getApplicationVersion = function ()
{
	var appXML = air.NativeApplication.nativeApplication.applicationDescriptor;
	var xmlObject = new DOMParser().parseFromString(appXML, "text/xml");
	var version = parseFloat(xmlObject.getElementsByTagName('version')[0].firstChild.nodeValue);
	
	return version;
}

Statistics.prototype.sendData = function ( data, callback )
{
	setTimeout(callback, 10000);
	var loader = new air.URLLoader();
	var thisRef = this;
	loader.addEventListener( air.Event.COMPLETE, function ( event ) { callback() } );
	loader.addEventListener( air.IOErrorEvent.IO_ERROR, function ( event ) { callback(); thisRef.error( event ) } );
	
//	for ( var k in data )
//	{
//		air.trace( k+"::"+data[k] );
//	}
	
	var request = new air.URLRequest("http://stats.twitulater.com/StatServer.py?api_key=cJdV72hJGIKXWtyoovR5fIvsXM3E" );
	request.userAgent = "Twitulater";
	request.method = air.URLRequestMethod.POST;
	request.data = data;
	
	loader.load( request );
}

Statistics.prototype.uptime = function ()
{
	var now = new Date().getTime()/1000;
	
	return now-this.timeStarted;
}

Statistics.prototype.tweeted = function ()
{
	this.tweetCount += 1;
}