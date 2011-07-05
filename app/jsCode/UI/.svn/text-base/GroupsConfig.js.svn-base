function GroupsConfig ( bundles )
{
	this.bundles = bundles;
	this.tabs = new Array();
	this.generatedTabs = {};
	this.groups = {};
	this.groupToIndex = {};
}

GroupsConfig.prototype.open = function ()
{
	var thisRef = this;
	var dialog = new Dialog( "Groups" );
	dialog.onWindowInit( function () { thisRef.setupInterface() } );
	dialog.size({
			"width" : 560,
			"height" : 500
		});
	dialog.open();
}

GroupsConfig.prototype.setupInterface = function ()
{
	this.makeTabs();
}

GroupsConfig.prototype.makeTabs = function ()
{
	var thisRef = this;
	for ( var userId in this.bundles )
	{
		var user = twitulaterUser.getUser( userId );
		this.tabs.push( userId );
		
		this.groups[ userId ] = new Array();
		this.groupToIndex[ userId ] = {};
				
		var emptyGroup = new Group({
					"id" : -1,
					"userId" : userId,
					"name" : Language.def( "groups_new" ),
					"description" : "",
				});
		emptyGroup.createGroupCallback = function ( group ) { thisRef.newGroup( group ) };
		this.groups[ userId ].push( emptyGroup );
		this.groupToIndex[ userId ][ emptyGroup.identifier() ] = 0;
		
		$("#Groups ul.tabs").append( "<li><a href=\"#groups_"+user.username+"\">"+user.username+"</a></li>" );
		$("#Groups").append( "<div id=\"groups_"+user.username+"\">"+
						"<div class=\"groups\">"+
							emptyGroup.toHTML()+
						"</div>"+
						"<div id=\"People\">"+
							"<div id=\"all\">"+
								"<p class=\"all\"></p>"+
								"<ul class=\"people\"></ul>"+
							"</div>"+
						"</div>");
	}
	
	var thisRef = this;
	$("#Groups").tabs({
			show: function ( event, ui ) { thisRef.tabShown( event, ui ) }
		})
		.tabs( "select", 0 );
}

GroupsConfig.prototype.tabShown = function ( event, ui )
{
	var userId = this.tabs[ ui.index ];
	
	if ( typeof( this.generatedTabs[ userId ] ) == "undefined" )
	{
		this.generatedTabs[ userId ] = true;
		this.displayGroups( userId );
		this.displayPeople( userId );
	}
}

GroupsConfig.prototype.displayGroups = function ( userId )
{
	var user = twitulaterUser.getUser( userId );
	var thisRef = this;
	var groups = this.bundles[ userId ].getGroups();
	this.groups[ userId ] = this.groups[ userId ].concat( groups );
	
	this.displayCount = 1;
	setTimeout( function () { thisRef.displayGroupsFromQueue( user ) }, 100 );
}

GroupsConfig.prototype.displayGroupsFromQueue = function ( user )
{
	var thisRef = this;
	var group = this.groups[ user.id ][ this.displayCount ];
	
	if ( typeof( group ) != "undefined" )
	{
		this.groupToIndex[ user.id ][ group.identifier() ] = this.displayCount;
		
		$("#Groups #groups_"+user.username+" .groups").append( group.toHTML() );
	
		this.displayCount += 1;
		setTimeout( function () { thisRef.displayGroupsFromQueue( user ) }, 1 );
	}else
	{
		this.activateDisplay( user );
		return;
	}
}

GroupsConfig.prototype.activateDisplay = function ( user )
{
	var thisRef = this;
		
	$("#Groups #groups_"+user.username+" .groups").accordion({
			autoHeight: false,
			collapsible: true,
			change: function ( event, ui ) { thisRef.activateAccordion( event, ui, user ) }
		})
		.accordion( "activate", 0 )
		
	for ( var i in this.groups[ user.id ] )
	{
		this.groups[ user.id ][ i ].activateHeader( function ( userId ) { thisRef.groupRemoved( userId ) } );
	}
}

GroupsConfig.prototype.activateAccordion = function ( event, ui, user )
{
	var groupId = ui.newHeader.attr( "rel" );
	var index = this.groupToIndex[ user.id ][ groupId ];
	
	if ( typeof( index ) != "undefined" )
	{
		var group = this.groups[ user.id ][ index ];
		group.activateDisplay();
		group.displayMembers();
	}
}

GroupsConfig.prototype.displayPeople = function ( userId )
{
	var user = twitulaterUser.getUser( userId );
	
	var peopleList = new PeopleListDisplay({
				"type" : "all",
				"user" : user,
				"db" : dataStorage.db,
				"parentSelector" : "#Groups #groups_"+user.username,
				"display" : "minimal",
			});
	peopleList.perPage = 12;
	peopleList.display();
	
	$("#Groups #groups_"+user.username+" ul.people").sortable({
			"connectWith" : "#Groups #groups_"+user.username+" .groups ul",
			"helper" : "original",
			"cursor" : "move"
		});
}

GroupsConfig.prototype.newGroup = function ( tmpGroup )
{
	var newGroup = tmpGroup.clone();
	var user = twitulaterUser.getUser( newGroup.userId );
	var identifier = tmpGroup.identifier();
	var thisRef = this;
	
	this.groups[ user.id ][ 0 ] = new Group({
					"id" : -1,
					"userId" : user.id,
					"name" : Language.def( "groups_new" ),
					"description" : "",
				});
	this.groups[ user.id ][ 0 ].createGroupCallback = function ( group ) { thisRef.newGroup( group ) };
	
	$("div."+identifier+" ul").html( "" );
	$("div."+identifier+" input").val( "" );
	$("div."+identifier+" count").html( 0 );
	
	var thisRef = this;
	newGroup.storeAndGetNewId( function ( group ) { thisRef.newGroupGotId( group ) } );
}

GroupsConfig.prototype.newGroupGotId = function ( group )
{
	var identifier = group.identifier();
	var user = twitulaterUser.getUser( group.userId );

	this.displayCount += 1;
	this.groups[ user.id ].push( group );
	this.groupToIndex[ user.id ][ identifier ] = this.groups[ user.id ].length-1;
	
	$("#Groups #groups_"+user.username+" .groups").accordion( "destroy" );
	$("#Groups #groups_"+user.username+" .groups").append( group.toHTML() );
	
	this.activateDisplay( user );
}

GroupsConfig.prototype.groupRemoved = function ( userId )
{
	var user = twitulaterUser.getUser( userId );
	$("#Groups #groups_"+user.username+" .groups").accordion( "destroy" );
	this.activateDisplay( user );
}