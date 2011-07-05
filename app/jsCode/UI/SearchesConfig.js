function SearchesConfig( bundles )
{
	this.bundles = bundles;
	this.tabs = new Array();
	this.generatedTabs = {};
}

SearchesConfig.prototype.open = function ()
{
	var thisRef = this;
	var dialog = new Dialog( "Searches" );
	dialog.onWindowInit( function () { thisRef.setupInterface() } );
	dialog.open();
}

SearchesConfig.prototype.setupInterface = function ()
{
	this.makeTabs();
}

SearchesConfig.prototype.makeTabs = function ()
{
	for ( var userId in this.bundles )
	{
		var user = twitulaterUser.getUser( userId );
		this.tabs.push( userId );
		
		$("#Searches ul.tabs").append( "<li><a href=\"#searches_"+user.username+"\">"+user.username+"</a></li>" );
		$("#Searches").append( "<div id=\"searches_"+user.username+"\"><input type=\"text\"><span class=\"new\">"+Language.def( "searches_new" )+"</span><br /><br />"+
								"<ul class=\"manual\"></ul><br />"+
								"<ul class=\"hashtag\"></ul><br />"+
								"<ul class=\"username\"></ul>"+
								"</div>" 
							);
	}
	
	var thisRef = this;
	$("#Searches").tabs({
			show: function ( event, ui ) { thisRef.tabShown( event, ui ) }
		})
		.tabs( "select", 0 );
}

SearchesConfig.prototype.tabShown = function ( event, ui )
{
	var userId = this.tabs[ ui.index ];
	
	if ( typeof( this.generatedTabs[ userId ] ) == "undefined" )
	{
		this.generatedTabs[ userId ] = true;
		this.tabContent( userId );
	}
}

SearchesConfig.prototype.tabContent = function ( userId )
{
	var user = twitulaterUser.getUser( userId );
	var thisRef = this;
	var searches = this.bundles[ userId ].getSearchTerms();
	
	$("#Searches #searches_"+user.username+" .new")
			.styledButton({
				"action" : function ( event ){ thisRef.newSearch( user ) },
				"display" : "inline-block"
			})
			.css({
				"position" : "relative",
				"top" : "4px"
			});
	$("#Searches #searches_"+user.username+" input")
			.keyup( function ( event ) {
				if ( event.keyCode == 13 )
				{
					thisRef.newSearch( user );
				}
			});
	
	this.displayQueue = searches;
	setTimeout( function () { thisRef.displayFromQueue( user ) }, 100 );
}

SearchesConfig.prototype.newSearch = function ( user )
{
	var newTerm = $("#Searches #searches_"+user.username+" input").val();
	
	if ( newTerm == "" )
	{
		return;
	}
	
	$("#Searches #searches_"+user.username+" input").val("");
	
	var thisRef = this;
	searches.add({ 
			"userId" : user.id, 
			"term" : newTerm, 
			"type" : searches.MANUAL_SEARCH, 
			"callback" : function ( search ) { thisRef.displayNewSearch( search, user ) } 
		});
}

SearchesConfig.prototype.displayNewSearch = function ( search, user )
{
	var term = search.term;
	
	this.displayQueue.push( term );
	this.displayFromQueue( user );
}

SearchesConfig.prototype.displayFromQueue = function ( user )
{
	var thisRef = this;
	var searchTerm = this.displayQueue.shift();
	
	if ( typeof( searchTerm ) == "undefined" )
	{
		return;
	}
	
	var search = this.bundles[ user.id ].getSearch( searchTerm );
	if ( typeof( search ) == "undefined" )
	{
		setTimeout( function () { thisRef.displayFromQueue( user ) }, 1 );
		return;
	}
	
	var identifier = search.identifier();
	
	$("#Searches #searches_"+user.username+" ul."+search.type).prepend( search.toHTML() );
	$("#Searches #searches_"+user.username+" li[class='"+identifier+"'] span.enable")
			.styledButton({
				"orientation" : "left",
				"role" : "checkbox",
				"checked" : search.enabled,
				"checkboxValue" : {
						"on" : 1,
						"off" : 0
					}
			})
			.css({
				"position" : "relative",
			})
			.change( function ( event ) { thisRef.changeSearchState( event ) });
	$("#Searches #searches_"+user.username+" li[class='"+identifier+"'] span.remove")
			.styledButton({
				"orientation" : "right",
				"action" : function ( event ) { thisRef.removeSearch( event ) }
			})
			.css({
				"position" : "relative",
			})
			.change( function ( event ) { thisRef.changeSearchState( event ) });
	$("#Searches #searches_"+user.username+" li[class='"+identifier+"']")
			.css({ "display" : "none" })
			.slideDown( "fast" );
	
	setTimeout( function () { thisRef.displayFromQueue( user ) }, 1 );
}

SearchesConfig.prototype.changeSearchState = function ( event )
{
	var searchTerm = $(event.target).parents( "li" ).attr( "term" );
	var userId = $(event.target).parents( "li" ).attr( "userid" );
	
	this.bundles[ userId ].changeSearchState( searchTerm );
}

SearchesConfig.prototype.removeSearch = function ( event )
{
	var searchTerm = $(event.target).parents( "li" ).attr( "term" );
	var userId = $(event.target).parents( "li" ).attr( "userid" );
	
	if ( !confirm( Language.def( "searches_remove_confirm" ).replace( "(t)", searchTerm ) ) ) 
	{
  		return;
  	}
	
	this.bundles[ userId ].remove( searchTerm );
	$(event.target).parents("li")
			.slideUp( "fast" );
}