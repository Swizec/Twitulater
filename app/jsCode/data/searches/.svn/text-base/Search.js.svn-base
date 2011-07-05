function Search ( userId, term, type, enabled )
{
	this.userId = userId;
	this.term = term;
	this.type = type;
	this.enabled = enabled;
}

Search.prototype.refresh = function ()
{
	if ( !this.enabled )
	{
		return;
	}
	
	var thisRef = this;
	PAL.searchRead({
		"userId" : this.userId,
		"term" : this.term,
		"callback" : function ( userId, tweets ) { thisRef.gotTweets( tweets ) }
	});
}

Search.prototype.gotTweets = function ( tweets )
{
	var tweets = services.parseData({
			"user" : this.userId, 
			"data" : tweets.results,
			"feed" : this.generateFeed()
		});
		
	mainDisplay.showNewTweets( this.userId, tweets );
}

Search.prototype.generateFeed = function ()
{
	if ( this.type == searches.MANUAL_SEARCH )
	{
		return "search:"+this.term;
	}else
	{
		return "search";
	}
}

Search.prototype.store = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;

	query.text = "INSERT INTO searches (user, term, type, enabled)VALUES( '"+this.userId+"', '"+this.term+"', '"+this.type+"', '"+Number( this.enabled )+"')";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
		this.update();
	}
}

Search.prototype.update = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;

	query.text = "UPDATE searches SET enabled='"+Number( this.enabled )+"' WHERE user='"+this.userId+"' AND term='"+this.term+"'";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

Search.prototype.remove = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;

	query.text = "DELETE FROM searches WHERE user='"+this.userId+"' AND term='"+this.term+"'";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
	}
}

Search.prototype.toHTML = function ()
{
	var html = "<li class=\""+this.identifier()+"\" userid=\""+this.userId+"\" term=\""+this.term+"\">"+
				"<term>"+this.term+"</term>"+
				"<span class=\"enable\">"+Language.def( "searches_enabled" )+"</span>"+
				"<span class=\"remove\">"+Language.def( "searches_remove" )+"</span>"+
				"</li>";
	
	return html;
}

Search.prototype.identifier = function ()
{
	return this.term+"_"+this.type;
}

Search.prototype.changeState = function ()
{
	this.enabled = !this.enabled;
	this.update();
}