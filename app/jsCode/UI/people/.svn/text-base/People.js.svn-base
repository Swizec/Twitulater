function People()
{
	this.db = dataStorage.db;
	this.loaded = {};
	this.user = twitulaterUser.activeUser();
	this.displays = {};
}

People.prototype.open = function ()
{
	var thisRef = this;
	
	var dialog = new Dialog( "People" );
	dialog.onWindowInit( function () { thisRef.setupInterface() } );
	dialog.onWindowClose( function () { thisRef.killInterface() } );
	dialog.size({
			"width" : 450,
			"height" : 500
		});
	dialog.setTitle( Language.def( "people" ) );
	dialog.open();
}

People.prototype.setupInterface = function ()
{
	var thisRef = this;
	
	$("#People").tabs({
			show: function ( event, ui ) { thisRef.tabShown( event, ui ) }
		});
}

People.prototype.killInterface = function ()
{
	for ( var i in this.displays )
	{
		this.displays[ i ].kill();
	}
}

People.prototype.tabShown = function ( event, ui )
{
	switch ( ui.index )
	{
		case 0:
			this.showPeople( "seen" );
			break;
		case 1:
			this.showPeople( "friends" );
			break;
		case 2:
			this.showPeople( "fans" );
			break;
		case 3:
			this.showPeople( "following" );
			break;
		case 4:
			this.showPeople( "blocked" );
			break;
	}
}

People.prototype.showPeople = function ( type )
{
	if ( !this.loaded[ type ] )
	{
		this.displays[ type ] = new PeopleListDisplay({ "type" : type, "user" : this.user, "db" : this.db, "display": "maximal" });
		this.displays[ type ].display();
		
		this.loaded[ type ] = true;
	}
}