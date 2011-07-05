function EventMaster()
{
	this.events = {};
	
	this.TWEET_TOO_LONG = "tweetTooLong";
	this.TWEET_NOT_TOO_LONG = "tweetNotTooLong";
	this.INIT_UI = "initUI";
}

EventMaster.prototype.registerListener = function ( eventName, callback )
{
	if ( typeof( this.events[ eventName ] ) == "undefined" )
	{
		this.events[ eventName ] = new Array();
	}
	
	this.events[ eventName ].push( callback );
}

EventMaster.prototype.triggerEvent = function ( eventName )
{
	if ( typeof( this.events[ eventName ] ) != "undefined" )
	{
		for ( var i in this.events[ eventName ] )
		{
			this.events[ eventName ][ i ]();
		}
	}
}