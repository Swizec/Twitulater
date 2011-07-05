function Person( data, user, displayType )
{
	this.user = user;
	this.displayType = ( typeof( displayType ) == "undefined" ) ? "maximal" : displayType;
	
	var data = this.sanitize( data );

	this.id = data.id;
	this.avatar = data.avatar;
	this.nick = data.nick;
	this.location = data.location;
	this.score = data.score;
}

Person.prototype.sanitize = function ( data )
{
	if ( typeof( data ) == "undefined" )
	{
		var data = {};
	}
	
	if ( typeof( data.avatar ) == "undefined" )
	{
		data.avatar = "";
	}else
	{
		data.avatar = unescape( data.avatar );
	}
	
	if ( typeof( data.location ) == "undefined" )
	{
		data.location = "";
	}else
	{
		data.location = unescape( data.location );
	}
	
	if ( typeof( data.emphasis ) == "undefined" )
	{
		data.score = "0";
	}else
	{
		data.score = unescape( data.emphasis );
	}
	
	data.nick = unescape( data.nick );
	
	return data;
}

Person.prototype.toHTML = function ()
{
	switch ( this.displayType )
	{
		case "maximal":
			return this.maximalHTML();
			break;
		case "minimal":
			return this.minimalHTML();
			break;
	}
}

Person.prototype.maximalHTML = function ()
{
	var html = "<li id=\""+this.uniqueId()+"\">";
	html += "<a href=\"\" class=\"nameLink\"><img src=\""+this.avatar+"\" /></a>";
	html += "<div class=\"info\"><strong><a href=\"\" class=\"nameLink\">"+this.parseNick()+"</a></strong>";
	html += "<p>"+this.location+"</p>";
	html += "<p>Score: "+this.score+"</p>";
	html += "</div>";
	html += "<div class=\"commands\">";
	html += this.commands();
	html += "</div>";
	html += "</li>";
	
	return html;
}

Person.prototype.minimalHTML = function ()
{
	var html = "<li id=\""+this.uniqueId()+"\">";
	html += "<img src=\""+this.avatar+"\" />";
	html += "<div class=\"info\"><strong>"+this.parseNick()+"</strong>";
	html += "</div>";
	html += "</li>";
	
	return html;
}

Person.prototype.uniqueId = function ()
{
	return this.user.id+"_"+this.id;
}

Person.prototype.parseNick = function ()
{
	if ( this.nick == "&lt;user_suspended&gt;" )
	{
		return "&lt;"+Language.def( "user_suspended" )+"&gt;";
	}
	
	return this.nick;
}

Person.prototype.commands = function ()
{
	var html = "";
	
	if ( socialGraphs.following( this.user.id, this.id ) )
	{
		html += "<span class=\"unfollow\">"+Language.def( "people_cmd_unfollow" )+"</span>";
	}else
	{
		html += "<span class=\"follow\">"+Language.def( "people_cmd_follow" )+"</span>";
	}
	
	html += "<br />";
	
	if ( socialGraphs.blocking( this.user.id, this.id ) )
	{
		html += "<span class=\"unblock\">"+Language.def( "people_cmd_unblock" )+"</span>";
	}else
	{
		html += "<span class=\"block\">"+Language.def( "people_cmd_block" )+"</span>";
	}
	
	return html
}

Person.prototype.activate = function ()
{
	var thisRef = this;
	
	this.activateCommand( "follow" );
	this.activateCommand( "unfollow" );
	this.activateCommand( "block" );
	this.activateCommand( "unblock" );
	
	$("#People li#"+this.uniqueId()+" a.nameLink").click( function ( event ) {
					var profile = new ProfileDisplay( thisRef.id );
					profile.open();
					event.preventDefault();
				});
}

Person.prototype.activateCommand = function ( type )
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

	$("#People li#"+this.uniqueId()+" span."+type)
		.css({
			"font-size" : "12px",
			"padding" : "2px 5px"
		})
		.styledButton({
			"action" : action,
			"orientation" : "alone"
		})
		.css({
			"position" : "relative"
		});
}

Person.prototype.changeCommand = function ( type )
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
	
	$("#People li#"+this.uniqueId()+" span."+type).html( Language.def( "people_cmd_"+inverse ) )
					.removeClass( "button" )
					.removeClass( type )
					.addClass( inverse )
					.css( "display", "inline" )
					.unbind( "click" );
					
	this.activateCommand( inverse );
}