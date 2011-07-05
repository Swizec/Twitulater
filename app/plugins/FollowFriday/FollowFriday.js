function FollowFriday()
{
	this.identifier = "followfriday";
	this.displayName = "FollowFriday Assistant";
	this.type = "service";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "Shows a button on fridays, enabling you to automatically recommend all your best people for #followfriday";

	var thisRef = this;	
	eventMaster.registerListener( eventMaster.INIT_GUI, function () { thisRef.showGUI() } );
}

FollowFriday.prototype.showGUI = function ()
{
	if ( this.notFriday() )
	{
		return;
	}
	
	if ( $("#FollowFriday").size() <= 0 )
	{
		$("#input #extraButtons").append( $("<span id=\"FollowFriday\" title=\"Create a #followfriday tweet automatically\">#followfriday</span>")
							.css({
								"font-size": "9px",
								"padding" : "2px 10px"
							})
						);
		$("#FollowFriday").styledButton({
						"action" : function () { pluginLoader.getPlugin( "followfriday" ).followfriday() }
					});
	}else
	{
		$("#FollowFriday").css( "display", "block" );
	}
}

FollowFriday.prototype.notFriday = function ()
{
	var today = new Date();
	
	return ( today.getDay() != 5 );
}

FollowFriday.prototype.followfriday = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "SELECT e.*, d.* "+
				"FROM people_emphasis e, people_data d "+
				"WHERE e.user="+twitulaterUser.activeUser().id+" AND d.id=e.id "+
				"ORDER BY e.emphasis DESC LIMIT 10";
	
	var thisRef = this;
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.gotSuggestions( event ) } );
	
	query.execute();
}

FollowFriday.prototype.gotSuggestions = function ( event )
{
	var data = event.target.getResult().data;
	
	if ( data == null )
	{
		return;
	}
	
	var text = "";
	
	for ( var i in data ) 
	{
		text += "@"+data[ i ].nick+" ";
	}
	
	text += "#followfriday";
	
	myTweet.value( text );
}
