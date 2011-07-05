function Pane ( params )
{
	this.tabId = params.tabId;
	this.type = params.type;
	this.displayName = params.displayName;
	this.parent = params.parent;
	this.shown = false;
	this.userId = params.userId;
	this.filter = /./;
	this.tweets = {};
	this.tweetCount = 0;
	this.displayCount = 0;
	
	this.initDisplay();
}

Pane.prototype.initDisplay = function ()
{
	var emptyPaneHTML = "<li class=\"tweetPane\" id=\""+this.type+"Frame\">"+
				"<h1>"+this.displayName+"(<span class=\""+this.type+"Count\">0</span>)</h1>"+
				"<span class=\"panelClose\">X</span>"+
				"<ul id=\""+this.type+"\" paneResizing=\"\">"+
					"<li class=\"newInsertionPoint\"></li>"+
					"<li class=\"oldInsertionPoint\">"+Language.def( "tweets_old" )+"</li>"+
				"</ul>"+
				"<div class=\"filter\">"+Language.def( "filter" )+": <span class=\"count\"></span><br /><input type=\"text\" value=\".\" class=\"filter\"/></div>"+
			"</li>";
			
	$("#"+this.tabId+" ").append( emptyPaneHTML );
	var thisRef = this;
	$("#"+this.tabId+" #"+this.tweetType+"Frame .panelClose").click( function () { thisRef.close() } );
}

Pane.prototype.appendTweet = function ( tweet, html )
{
	if ( tweet.text.match( this.filter ) )
	{
		$("#"+this.tabId+" #"+this.type).append( html );
		this.displayCount += 1;
	}else
	{
		$("#"+this.tabId+" #"+this.type).append( html );
		$("#"+this.tabId+" #"+this.type+" .id_"+tweet.id).css( "display", "none" );
	}
	
	this.cache( tweet );
}

Pane.prototype.addTweet = function ( tweet, html, age )
{
	if ( tweet.text.match( this.filter ) )
	{
		if ( age == "new" )
		{
			$("#"+this.tabId+" #"+this.type).prepend( html );
		}else
		{
			$("#"+this.tabId+" #"+this.type).prepend( html );
		}
		this.displayCount += 1;
	}else
	{
		if ( age == "new" )
		{
			$("#"+this.tabId+" #"+this.type).prepend( html );
		}else
		{
				$("#"+this.tabId+" #"+this.type).append( html );
		}
		$("#"+this.tabId+" #"+this.type+" .id_"+tweet.id).css( "display", "none" );
	}
	
	this.tweetCount += 1;
	this.cache( tweet );
	this.refreshCountDisplay();
}

Pane.prototype.cache = function ( tweet )
{
	this.tweets[ tweet.id ] = {
			"text": tweet.text,
			"nick" : tweet.poster.nick
		};
}

Pane.prototype.close = function ()
{
	var width = $("#"+this.tabId+" #paneContainer #"+this.type+"Frame").width()+5;
	
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame")
				.animate( {
					opacity: "0"
				}, 200 )
				.remove();
	this.parent.resetFreshCount( this.type );
	this.preparePaneContainerSize( -width );
	
	this.shown = false;
}

Pane.prototype.open = function ()
{
	this.shown = true;
	
	var height = mainDisplay.viewHeight();
	var thisRef = this;
	
	this.preparePaneContainerSize( 285 );
	
	$("#"+this.tabId+" #"+this.type+"Frame").clone( true ).prependTo( "#"+this.tabId+" #paneContainer" );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame")
				.css({
					width: "280px",
					display: "block",
					opacity: "0",
					float: "left"
				})
				.addClass("displayed")
				.height( height )
				.animate({ "opacity": "1.0" }, 400 )
				.resizable({
					handles: "e, se",
					alsoResize: "[paneTabResizing='"+this.userId+"']",
					resize: function ( event, ui ) { thisRef.resizing(); },
					maxHeight: height,
					minHeight: height,
					minWidth: 180,
					autoHide: true,
				})
				.hover(
					function () { thisRef.openFilter() },
					function () { thisRef.closeFilter() }
				);
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame ul").attr( "paneResizing", this.userId );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame .filter").attr( "paneResizing", this.userId );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame input.filter").keyup( function ( event ) { thisRef.filterTweets( event ) } ).click(function () {
         $(this).select();
    });
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame .panelClose").styledButton({
			"action" : function () { thisRef.close() },
			"display" : "inline-block"
		});
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame .jScrollPaneContainer")
			.height( height )
			.attr( "paneResizing", this.userId );
			
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame ul").jScrollPane({
		showArrows: false,
		scrollBarWidth: 5,
		scrollBarMargin: 0,
		wheelSpeed: 25,
	});
	
	$("#"+this.tabId+" #paneContainer").sortable({
		axis: "x",
		cursor: "move",
		containment: "parent",
		items: ".tweetPane",
		opacity: 0.5,
		handle: "h1",
	});

	mainDisplay.initTweetMenus( "#"+this.tabId+" #paneContainer #"+this.type+"Frame .tweetMenu" );
	
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame").longurlplease({
		"transport" : "air"
	});
}

Pane.prototype.refresh = function ()
{
	mainDisplay.initTweetMenus( "#"+this.tabId+" #paneContainer #"+this.type+"Frame .tweetMenu" );
	
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame").longurlplease({
		"transport" : "air"
	});
}

Pane.prototype.preparePaneContainerSize = function ( delta )
{
	$("#"+this.tabId).width( $("#"+this.tabId).width()+delta );
	$("#"+this.tabId+" #paneContainer").width( $("#"+this.tabId+" #paneContainer").width()+delta );
}

Pane.prototype.resizing = function ()
{
	var width = $("#"+this.tabId+" #paneContainer #"+this.type+"Frame").width();
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame ul").width( width );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame .jScrollPaneContainer").width( width );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame .tweet").width( width*0.98-16 );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame .tweet block").width( width-80 );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame .tweet label").width( width-29 );
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame div.filter").width( width );
}

Pane.prototype.openFilter = function ()
{
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame div.filter" )
				.css({ 
						height: 0,
						display: "block" 
					})
				.animate({ height: 50 }, 200 );
	this.refreshCountDisplay();
}

Pane.prototype.closeFilter = function ()
{
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame div.filter" )
				.animate({ height: 0 }, 200 );
}

Pane.prototype.filterTweets = function ( event )
{
	var filter = $("#"+this.tabId+" #paneContainer #"+this.type+"Frame input.filter").val();
	
	if ( filter == "" )
	{
		filter = ".";
	}
	
	this.filter = new RegExp( filter );
	this.displayCount = 0;
	
	for ( var tweetId in this.tweets )
	{
		if ( !this.tweets[ tweetId ].text.match( this.filter ) && !this.tweets[ tweetId ].nick.match( this.filter ) )
		{
			$("#"+this.tabId+" #"+this.type+" .id_"+tweetId).css( "display", "none" );
		}else
		{
			$("#"+this.tabId+" #"+this.type+" .id_"+tweetId).css( "display", "block" );
			this.displayCount += 1;
		}
	}
	
	this.refreshCountDisplay();
}

Pane.prototype.refreshCountDisplay = function ()
{
	$("#"+this.tabId+" #paneContainer #"+this.type+"Frame div.filter .count")
					.html( 
						"( "+Language.def( "filter_displayed" ).replace( "(dc)", this.displayCount ).replace( "(tc)", this.tweetCount )+" )"
					);
}