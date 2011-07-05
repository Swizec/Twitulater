function PeopleListDisplay( params )
{
	this.user = params.user;
	this.type = params.type;
	this.db = params.db;
	this.parentSelector = ( typeof( params.parentSelector ) == "undefined" ) ? "" : params.parentSelector;
	this.personDisplay = ( typeof( params.display ) == "undefined" ) ? "maximal" : params.display;
	this.killed = false;
	this.people = new Array();
	this.perPage = 20;
	this.displayCount = 0;
	this.displayPage = 0;
	this.displayQueue = new Array();
	this.displayPeoplePager = true;
}

PeopleListDisplay.prototype.display = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;
	query.text = this.getSql();
	
	var thisRef = this;
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) { thisRef.gotPeople( event ) } );
	
	query.execute();
}

PeopleListDisplay.prototype.getSql = function ()
{
	if ( this.type == "seen" )
	{
		return "SELECT DISTINCT(d.nick) AS nick, d.*, e.emphasis AS emphasis "+
			"FROM people p, people_data d, people_emphasis e "+
			"WHERE p.id=d.id AND d.protocol='"+this.user.protocol+"' AND p.id=e.id AND p.user='"+this.user.id+"' AND p.user=e.user AND p.type='seen' AND p.nick NOT LIKE '%user_suspended%' "+
			"ORDER BY e.emphasis DESC";
	}else if ( this.type == "friends" )
	{
		return "SELECT DISTINCT(d.nick), d.*, e.emphasis "+
			"FROM people p1, people p2, people_data d, people_emphasis e "+
			"WHERE p1.id=d.id AND d.protocol='"+this.user.protocol+"' AND p1.id=e.id AND p1.user='"+this.user.id+"' AND p1.user=e.user AND p1.type='following' AND p2.type='followers' AND p1.id=p2.id  AND p1.nick NOT LIKE '%user_suspended%' AND "+
				"(SELECT COUNT(*) "+
					"FROM people "+
					"WHERE id=p1.id AND type='blocked'"+
				")==0 "+
			"ORDER BY e.emphasis DESC";
	}else if ( this.type == "fans" )
	{
		return "SELECT DISTINCT(d.nick), d.*, e.emphasis "+
			"FROM people p, people_data d, people_emphasis e "+
			"WHERE p.id=d.id AND d.protocol='"+this.user.protocol+"' AND p.id=e.id AND p.user='"+this.user.id+"' AND p.user=e.user AND p.type='followers' AND p.nick NOT LIKE '%user_suspended%' AND "+
				"(SELECT COUNT(*) "+
					"FROM people "+
					"WHERE id=p.id AND type='following'"+
				")==0 AND"+
				"(SELECT COUNT(*) "+
					"FROM people "+
					"WHERE id=p.id AND type='blocked'"+
				")==0 "+
			"ORDER BY e.emphasis DESC";
	}else if ( this.type == "following" )
	{
		return "SELECT DISTINCT(d.nick), d.*, e.emphasis "+
			"FROM people p, people_data d, people_emphasis e "+
			"WHERE p.id=d.id AND d.protocol='"+this.user.protocol+"' AND p.id=e.id AND p.user='"+this.user.id+"' AND p.user=e.user AND p.type='following' AND p.nick NOT LIKE '%user_suspended%' AND "+
				"(SELECT COUNT(*) "+
					"FROM people "+
					"WHERE id=p.id AND type='followers'"+
				")==0 AND"+
				"(SELECT COUNT(*) "+
					"FROM people "+
					"WHERE id=p.id AND type='blocked'"+
				")==0 "+
			"ORDER BY e.emphasis DESC";
	}else if ( this.type == "blocked" )
	{
		return "SELECT DISTINCT(d.nick), d.*, e.emphasis "+
			"FROM people p, people_data d, people_emphasis e "+
			"WHERE p.id=d.id AND d.protocol='"+this.user.protocol+"' AND p.id=e.id AND p.user='"+this.user.id+"' AND p.user=e.user AND p.type='blocked' AND p.nick NOT LIKE '%user_suspended%' "+
			"ORDER BY p.nick ASC";
	}else if ( this.type == "all" )
	{
		return "SELECT d.*, e.emphasis "+
			"FROM people p, people_data d, people_emphasis e "+
			"WHERE p.id=d.id AND d.protocol='"+this.user.protocol+"' AND p.id=e.id AND p.user='"+this.user.id+"' AND p.user=e.user AND p.nick NOT LIKE '%user_suspended%'"+
			"GROUP BY p.nick "+
			"ORDER BY p.nick ASC";
	}
}

PeopleListDisplay.prototype.gotPeople = function ( event )
{
	var result = event.target.getResult();
	
	if ( result.data == null )
	{
		$(this.parentSelector+" #People p."+this.type).html( Language.def( "people_none" ) );
		return 0;
	}
	
	if ( this.personDisplay == "maximal" )
	{
		$(this.parentSelector+" #People p."+this.type).html( Language.def( "people_"+this.type ).replace( /\(u\)/g, this.user.username ).replace( /\(p\)/g, this.user.protocol ).replace( /\(c\)/g, result.data.length ) );
	}
	
	this.people = result.data;
	this.displayCount = 0;
	this.displayPage = 0;
	var thisRef = this;
	this.displayQueue = this.displayQueue.concat( this.people );
	if(this.displayPeoplePager){
		this.pager = new PeoplePager({
				"parentSelector" : this.parentSelector+" #People #"+this.type,
				"pageCallback" : function ( page ) { thisRef.changePage( page ) },
				"filterCallback" : function ( filter ) { thisRef.filterDisplay( filter ) },
				"peopleCount" : this.displayQueue.length,
				"perPage" : this.perPage,
				"position" : ( this.personDisplay == "maximal" ) ? "bottom" : "top"
			});
		this.pager.display();
	}
	
	var thisRef = this;
	this.displayPeople();
// 	setTimeout( function () { thisRef.displayPeople() }, 1 );
}

PeopleListDisplay.prototype.displayPeople = function ()
{
	for ( var i = 0; i < this.perPage; i += 1 )
	{
		var rawPerson = this.displayQueue[ i+this.perPage*this.displayPage ];
		if ( this.shouldStopDisplaying( rawPerson ) )
		{
			break;
		}
		
		var person = new Person( rawPerson, this.user, this.personDisplay );
		this.displayPerson( person );
	}
}

PeopleListDisplay.prototype.shouldStopDisplaying = function ( rawPerson )
{
	return typeof( rawPerson ) == "undefined" || this.killed/* || $(this.parentSelector+" div#People:visible").size() == 0*/;
}

PeopleListDisplay.prototype.displayPerson = function ( person )
{
	$(this.parentSelector+" #People #"+this.type+" ul").append( person.toHTML() );
	person.activate();
}

PeopleListDisplay.prototype.kill = function ()
{
	this.killed = true;
}

PeopleListDisplay.prototype.changePage = function ( page )
{
	$(this.parentSelector+" #People #"+this.type+" ul").html( "" );
	this.displayCount = 0;
	this.displayPage = page;
	
	this.displayPeople();
}

PeopleListDisplay.prototype.filterDisplay = function ( filter )
{
	var filter = ( filter == "" ) ? "." : filter;
	filter.toLowerCase();
	this.displayQueue = new Array();
	$(this.parentSelector+" #People #"+this.type+" ul").html( "" );
	this.displayCount = 0;
	this.displayPage = 0;
	
	for ( var i in this.people )
	{
		if ( this.people[ i ].nick.toLowerCase().match( filter ) )
		{
			this.displayQueue.push( this.people[ i ] );
		}
	}
	
	var thisRef = this;
	this.pager = new PeoplePager({
			"parentSelector" : this.parentSelector+" #People #"+this.type,
			"pageCallback" : function ( page ) { thisRef.changePage( page ) },
			"filterCallback" : function ( filter ) { thisRef.filterDisplay( filter ) },
			"peopleCount" : this.displayQueue.length,
			"perPage" : this.perPage,
			"position" : ( this.personDisplay == "maximal" ) ? "bottom" : "top"
		});
	this.pager.refresh();
	
	this.displayPeople();
}