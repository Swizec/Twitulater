function PaneMenu( tabId, openCallback, userId )
{
	this.tabId = tabId;
	this.items = new Array();
	this.openCallback = openCallback;
	this.userId = userId;
	
	this.initDisplay();
}

PaneMenu.prototype.initDisplay = function ()
{
	var initialItems = [ "dm", "reply", "link", "question", "happy", "sad", "other", "rt", "my", "all", "spam" ];
	for ( var i = 0; i < initialItems.length; i++ )
	{
		var item = initialItems[ i ];
		this.addItem( item+"Tweets", Language.def( "category_"+item ), "primary" );
	}
	
	var height = mainDisplay.viewHeight();

	$("#"+this.tabId+" .paneMenuContainer")
		.height( height )
		.resizable({
			handles: "e, se",
			alsoResize: "[menuResizing='"+this.userId+"']",
			maxHeight: height,
			minHeight: height,
			autoHide: true
		});
		
	$("#"+this.tabId+" .paneMenuContainer .jScrollPaneContainer").height( height );
	$("#"+this.tabId+" .paneMenu ul")
		.sortable({
			cursor: "move",
			containment: "#"+this.tabId+" .paneMenuContainer",
			accept: "menuEntry",
			opacity: .8,
			placeholder: "ui-state-highlight",
			connectWith: "#"+this.tabId+" .paneMenu ul"
		})
		.attr( "menuResizing", this.userId );
}

PaneMenu.prototype.refresh = function ()
{
	$("#"+this.tabId+" .paneMenu").jScrollPane({
				showArrows: false,
				scrollBarWidth: 5,
				scrollBarMargin: 0,
				wheelSpeed: 25
			});
}

PaneMenu.prototype.addItem = function ( tweetType, displayName, entryType )
{
	if ( typeof( entryType ) == "undefined" )
	{
		var entryType = "primary";
	}
	var thisRef = this;
	
	var emptyMenuHTML = "<li class=\""+tweetType+"Menu menuEntry\">"+displayName+" (<span class=\""+tweetType+"Count\">0</span>)</li>";
	$("#"+this.tabId+" .paneMenu ."+entryType).append( emptyMenuHTML );
	$("#"+this.tabId+" .paneMenu ."+tweetType+"Menu")
				.click( function () { thisRef.openCallback( tweetType ) } )
				.css({ "font-size" : this.typeToSize( entryType ) });
	
	this.items.push( tweetType );
	
// 	this.refresh();
}

PaneMenu.prototype.typeToSize = function ( importance )
{
	switch( importance )
	{
		case "primary":
		case "searches":
		case "groups":
			return "1.05em";
			break;
		case "hashtag":
			return "0.8em";
			break;
	}
}

PaneMenu.prototype.width = function ()
{
	return $("#"+this.tabId+" .paneMenuContainer").width()+5;
}