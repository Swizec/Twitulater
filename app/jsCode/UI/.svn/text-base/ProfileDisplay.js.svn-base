function ProfileDisplay( id )
{
	this.id = id;
	this.user = twitulaterUser.activeUser();
}

ProfileDisplay.prototype.open = function ()
{
	var thisRef = this;
	
	this.dialog = new Dialog( "Profile" );
	this.dialog.size({
			"width" : 400,
			"height" : 500
		})
// 	this.dialog.onWindowInit( function () { thisRef.activate() } );

	this.readInfo();
}

ProfileDisplay.prototype.readInfo = function ()
{
	var thisRef = this;
	PAL.fetchPerson({
			"userId" : this.user.id,
			"id" : this.id,
			"goodCallback" : function ( event ) { thisRef.readedInfo( event ) },
			"badCallback" : function ( event ) { thisRef.failReadingInfo( event ) }
		});
}

ProfileDisplay.prototype.readedInfo = function ( event )
{
	var data = JSON.parse( event.target.data );
	
	this.dialog.setTitle( data.screen_name );
	
	this.dialog.open();
	
	$("#Profile commands").html( this.commands() );
	$("#Profile avatar").html( '<img src="'+data.profile_image_url.replace( "_normal", "" )+'" />' );
	$("#Profile name").html( data.name );
	$("#Profile location").html( data.location );
	$("#Profile description").html( data.description );
	$("#Profile time_zone").html( data.time_zone+", "+this.localTime( data.utc_offset ) );
	$("#Profile statuses").html( Language.def( "profile_statusCount").replace( /\(c\)/, data.statuses_count ) );
	$("#Profile following").html( Language.def( "profile_following").replace( /\(c\)/, data.friends_count ) );
	$("#Profile followers").html( Language.def( "profile_followers").replace( /\(c\)/, data.followers_count ) );
	
	this.activate();
}

ProfileDisplay.prototype.commands = function ()
{
	var html = "";
	
	if ( socialGraphs.following( this.user.id, this.id ) )
	{
		html += "<span class=\"unfollow\">"+Language.def( "people_cmd_unfollow" )+"</span>";
	}else
	{
		html += "<span class=\"follow\">"+Language.def( "people_cmd_follow" )+"</span>";
	}
	
	html += "&nbsp;";
	
	if ( socialGraphs.blocking( this.user.id, this.id ) )
	{
		html += "<span class=\"unblock\">"+Language.def( "people_cmd_unblock" )+"</span>";
	}else
	{
		html += "<span class=\"block\">"+Language.def( "people_cmd_block" )+"</span>";
	}
	
	return html
}

ProfileDisplay.prototype.localTime = function ( utc_offset )
{
	var date = new Date();
	var myTime = date.getTime();
	var utc  = myTime + date.getTimezoneOffset()*30000 + utc_offset*1000;
	var localTime = new Date(utc);
	
	return localTime.toLocaleString();
}

ProfileDisplay.prototype.failReadingInfo = function ( event )
{
	notifier.showStatus( Language.def( "profile_read_fail" ) );
}

ProfileDisplay.prototype.activate = function ()
{
	this.activateCommand( "follow" );
	this.activateCommand( "unfollow" );
	this.activateCommand( "block" );
	this.activateCommand( "unblock" );
}

ProfileDisplay.prototype.activateCommand = function ( type )
{
	var action = "";
	var thisRef = this;
	
	if ( type == "follow" )
	{
		var action = function () { 
					socialGraphs.follow( thisRef.user.id, thisRef.id, function () { thisRef.changeCommand( "follow" ) } ) 
				}
	}else if ( type == "unfollow" )
	{
		var action = function () { 
					socialGraphs.unfollow( thisRef.user.id, thisRef.id, function () { thisRef.changeCommand( "unfollow" ) } ) 
				}
	}else if ( type == "block" )
	{
		var action = function () { 
					socialGraphs.block( thisRef.user.id, thisRef.id, function () { thisRef.changeCommand( "block" ) } ) 
				}
	}else if ( type == "unblock" )
	{
		var action = function () { 
					socialGraphs.unblock( thisRef.user.id, thisRef.id, function () { thisRef.changeCommand( "unblock" ) } ) 
				}
	}

	$("#Profile span."+type)
		.css({
			"font-size" : "14px",
			"padding" : "3px 8px"
		})
		.styledButton({
			"action" : action,
			"orientation" : "alone"
		})
		.css({
			"position" : "relative"
		});
}

ProfileDisplay.prototype.changeCommand = function ( type )
{
	var inverse = "";
	
	if ( type == "follow" )
	{
		var inverse = "unfollow";
	}else if ( type == "unfollow" )
	{
		var inverse = "follow";
	}else if ( type == "block" )
	{
		var inverse = "unblock";
	}else if ( type == "unblock" )
	{
		var inverse = "block";
	}
	
	$("#Profile span."+type).html( Language.def( "people_cmd_"+inverse ) )
					.removeClass( "button" )
					.removeClass( type )
					.addClass( inverse )
					.css( "display", "inline" )
					.unbind( "click" );
					
	this.activateCommand( inverse );
}