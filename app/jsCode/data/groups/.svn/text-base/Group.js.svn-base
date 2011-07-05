function Group ( params )
{
	this.id = params.id;
	this.userId = params.userId;
	this.name = unescape( params.name );
	this.description = unescape( params.description );
	this.members = new Array();
	this.memberIds = {};
	this.newMembers = new Array();
	this.goneMembers = new Array();
	
	this.membersFromDB();
}

Group.prototype.membersFromDB = function ()
{
	var user = twitulaterUser.getUser( this.userId );
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;


	query.text = "SELECT d.*, e.emphasis "+
			"FROM people p, people_data d, people_emphasis e, group2person g2p "+
			"WHERE p.id=d.id AND d.protocol='"+user.protocol+"' AND p.id=e.id AND p.user='"+user.id+"' AND p.user=e.user AND g2p.person_id=p.id AND g2p.group_id='"+this.id+"'"+
			"ORDER BY p.nick ASC";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.fetchedMembers( event ) } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

Group.prototype.fetchedMembers = function ( event )
{
	var members = event.target.getResult().data;
	var user = twitulaterUser.getUser( this.userId );
	
	if ( members == null )
	{
		return;
	}
	
	for ( var i in members )
	{
		this.add( new Person( members[ i ], user, "minimal" ) );
	}
}

Group.prototype.add = function ( person )
{
	if ( typeof( this.memberIds[ person.id ] ) == "undefined" )
	{
		this.members.push( person );
		this.memberIds[ person.id ] = true;
	}
}

Group.prototype.identifier = function ()
{
	return "group_"+this.id+"_"+this.userId;
}

Group.prototype.toHTML = function ()
{
	var inputValue = ( this.id > 0 ) ? this.name : "";
	var remove = ( this.id > 0 ) ? "<span class=\"remove\">X</span>" : "";
	
	var html = "<h3 class=\""+this.identifier()+"\" rel=\""+this.identifier()+"\"><a href=\"#\">"+this.name+" ("+this.members.length+")</a>"+remove+"</h3>"+
			"<div class=\"group "+this.identifier()+"\">"+
				Language.def( "groups_name" )+": <input type=\"text\" value=\""+inputValue+"\"><br />"+
				"Members: <count>"+this.members.length+"</count><br />"+
				"<ul></ul>"+
				"<span class=\"save\">"+Language.def( "groups_save" )+"</span>"+
				"<span class=\"success\"></span>"+
			"</div>";
	
	return html;
}

Group.prototype.displayMembers = function ()
{
	if ( this.displayingMembers )
	{
		return;
	}
	
	this.displayingMembers = true;
	this.memberDisplayIndex = 0;
	
	this.asyncMemberDisplay();
}

Group.prototype.asyncMemberDisplay = function ()
{
	var member = this.members[ this.memberDisplayIndex ];
	
	if ( typeof( member ) == "undefined" )
	{
		this.displayingMembers = false;
		return;
	}
	
	$("."+this.identifier()+" ul").append( member.toHTML() );
	
	$("."+this.identifier()+" ul #"+member.uniqueId()+" .info")
							.append( "<span class=\"remove\" identifier=\""+this.identifier()+"\">X</span>" )
	$("."+this.identifier()+" ul #"+member.uniqueId()+" .info .remove").css({
								"font-size" : "10px",
								"padding" : "1px 3px",
								"color" : "black",
							})
							.styledButton({
									"action" : function ( event ) { 
												$(this).parents( "li" ).remove();
												
												var counter = $("."+$(this).attr( "identifier" )+" count");
												counter.html( Number( counter.html() )-1 );
											}
								})
							.css( "position", "relative" );
	
	
	this.memberDisplayIndex += 1;
	var thisRef = this;
	setTimeout( function () { thisRef.asyncMemberDisplay() }, 1 );
}

Group.prototype.amendMembers = function ( desiredMembers )
{
	var desiredIds = this.desiredMembersToIds( desiredMembers );
	var user = twitulaterUser.getUser( this.userId );
	
	for ( var i in this.members )
	{
		var id = this.members[ i ].id;
		if ( typeof( desiredIds[ id ] ) == "undefined" )
		{
			this.goneMembers.push( id );
			this.members.splice( i, 1 );
			this.memberIds[ id ] = false;
		}
	}
	
	for ( var id in desiredIds )
	{
		if ( !this.isMember( id ) )
		{
			this.newMembers.push( id );
			this.add( new Person({ 
						"id" : id,
						"nick" : $("#"+this.userId+"_"+id+" strong").html(),
						"avatar" : $("#"+this.userId+"_"+id+" img").attr( "src" )
					}, user, "minimal" ) );
		}
	}
}

Group.prototype.desiredMembersToIds = function ( members )
{
	var ids = {}
	
	for ( var i in members )
	{
		ids[ members[ i ].replace( this.userId+"_", "" ) ] = true;
	}
	
	return ids;
}

Group.prototype.isMember = function ( id )
{
	return this.memberIds[ id ];
}

Group.prototype.changeName = function ( newName )
{
	this.name = newName;
}

Group.prototype.save = function ()
{
	if ( this.id < 0 )
	{
		this.storeAndGetNewId();
	}
	
	var thisRef = this;
	
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.text = "UPDATE groups SET name='"+escape( this.name )+"' WHERE rowid='"+this.id+"'";
	query.execute();
	
	for ( var i in this.newMembers )
	{
		query.text = "INSERT INTO group2person (group_id, person_id)VALUES( '"+this.id+"', '"+this.newMembers[ i ]+"' )";
		try
		{
			query.execute();
		}catch ( e )
		{
		}
	}
	
	for ( var i in this.goneMembers )
	{
		query.text = "DELETE FROM group2person WHERE group_id='"+this.id+"' AND person_id='"+this.goneMembers[ i ]+"'";
		query.execute();
	}
	
	$("."+this.identifier()+" span.success")
			.html( Language.def( "groups_saved" ) )
			.css( "opacity", 1 )
			.fadeOut("slow");
}

Group.prototype.storeAndGetNewId = function ( callback )
{
	var thisRef = this;
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;

	query.text = "INSERT INTO groups (user, name)VALUES( '"+this.userId+"', '"+escape( this.name )+"')";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.stored( event, callback ) } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

Group.prototype.stored = function ( event, callback )
{
	var thisRef = this;
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;

	query.text = "SELECT rowid FROM groups ORDER BY rowid DESC LIMIT 1";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.gotId( event, callback ); } );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	query.execute();
}

Group.prototype.gotId = function ( event, callback )
{
	var data = event.target.getResult().data;
	
	this.id = data[ 0 ].rowid;
	
	if ( typeof( callback ) == "function" )
	{
		callback( this );
	}
	
	this.save();
}

Group.prototype.activateDisplay = function ()
{
	var thisRef = this;
	var identifier = this.identifier();
	
	$("div."+identifier+" .save")
		.css({
			"font-size" : "14px",
			"padding" : "2px 4px",
		})
		.styledButton({
				"action" : function ( event ) { thisRef.saveFromDisplay( event ) }
			})
		.css( "position", "relative" );
	$("div."+identifier+" input")
				.keyup( function ( event ) 
						{ 
							if ( event.keyCode == 13 ) 
							{ 
								thisRef.saveFromDisplay( event );
							} 
						});
	$("div."+identifier+" ul")
		.html( "" )
		.sortable({
			"receive" : function ( event, ui ) 
					{
						thisRef.displayReceivedItem( event, ui );
					},
			"cursor" : "move"
		});
}

Group.prototype.activateHeader = function ( removeCallback )
{
	var identifier = this.identifier();
	var thisRef = this;
	
	$("h3."+identifier+" .remove")
		.css({
			"font-size" : "14px",
			"padding" : "2px 4px",
		})
		.styledButton({
				"action" : function ( event ) { thisRef.removeGroup( event, removeCallback ) }
			})
		.css( "position", "relative" );
}

Group.prototype.saveFromDisplay = function ( event )
{
	var identifier = this.identifier();
	var newName = $("div."+identifier+" input").val();
	var desiredMembers = $("div."+identifier+" ul").sortable( "toArray" );
	
	this.amendMembers( desiredMembers );
	this.changeName( newName );
	
	if ( this.id < 0 )
	{
		this.createGroupCallback( this ); 
	}else
	{	
		this.save();
		$("h3."+identifier+" a").html( newName+" ("+desiredMembers.length+")" );
	}
}

Group.prototype.displayReceivedItem = function ( event, ui )
{
	ui.sender.append( ui.item.clone() );
	var identifier = this.identifier();
	var count = 0;
	var items = $("div."+identifier+" ul").sortable("toArray");
	for ( var i in items )
	{
		if ( items[ i ] == ui.item.attr( "id" ) )
		{
			count += 1;
		}
	}

	if ( count > 1 )
	{
		ui.item.remove();
	}
	
	var counter = $("div."+identifier+" count");
	var count = Number( counter.html() );
	count += 1;
	counter.html( count );
	
	ui.item.children(".info").append( "<span class=\"remove\">X</span>" );
	$(ui.item).children(".info").children( ".remove" )
			.css({
				"font-size" : "10px",
				"padding" : "1px 3px",
				"color" : "black",
			})
			.styledButton({
					"action" : function ( event ) { ui.item.remove(); counter.html( Number(counter.html())-1 ) }
				})
			.css( "position", "relative" );
}

Group.prototype.removeGroup = function ( event, removeCallback )
{
	event.stopPropagation();
	
	if ( !confirm( Language.def( "groups_remove_confirm" ).replace( "(g)", this.name ) ) ) 
	{
  		return;
  	}
	
	var userId = this.userId;
	Groups.removeGroup( userId, this.id );
	
	$("."+this.identifier()).fadeOut( "slow", 
										function () { 
											if ( typeof( removeCallback ) == "function" ) 
											{ 
												removeCallback( userId ) 
											} 
										} 
									);
	
}

Group.prototype.clone = function ()
{
	var temp = new Group({
					"id" : this.id,
					"userId" : this.userId,
					"name" : this.name,
					"description" : this.description
				});
	temp.members = this.members.slice(0);
	for ( var id in this.memberIds )
	{
		temp.memberIds[ id ] = this.memberIds[ id ];
	}
	
	return temp;
}