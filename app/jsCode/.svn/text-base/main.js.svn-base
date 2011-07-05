
eventMaster = new EventMaster();

pluginLoader = new PluginLoader();
pluginLoader.loadPlugins();

$(document).ready( function ()
{
	AIRUpdater.init();
	Main = new Main();
	Main.initCode();
} );

function Main()
{
}

Main.prototype.initCode = function ()
{
	Growl.init({
		onerror: function onerror(errorCode, errorDescription){
// 				alert("ERROR:\r\n\r\n" + errorCode + " - " + errorDescription);
			}
	});
	pluginLoader.init();
	
	OAuth = new OAuth();
	twitulaterUser = new TwitulaterUser();
	PAL = new PAL();
	mainDisplay = new MainDisplay( window.nativeWindow );
	dataStorage = new DataStorage();
	myTweet = new MyTweet();
	contentRefresher = new ContentRefresher();
	notifier = new Notifier();
	services = new Services();
	settings = new Settings( dataStorage.dbConnection() );
	USAL = new USAL();
	FHAL = new FHAL();
	statistics = new Statistics();
	emphases = new Emphases( dataStorage.db );
	socialGraphs = new SocialGraphs();
	searches = new Searches();
	Groups = new Groups(); 
	hashTags = new HashTags();
	autoCompleteHashTags = new AutoCompleteHashTags();
	
	emphases.init();
	statistics.register();
	
	window.nativeWindow.activate();
	window.nativeWindow.addEventListener( air.Event.CLOSING, function ( event ) { mainDisplay.mainWindowClosing( event ) } );
	
	Language = new Language();
	
	if ( Language.initialised )
	{
		this.initInterface();
	}
}

Main.prototype.initInterface = function ()
{
	Language.replaces( "body" );

	twitulaterUser.fetchOrSetLogin();

	$tabs = $("#tabs").tabs({
		show: function(e, ui) {
			mainDisplay.tabShown( ui.index );
		},
	});

	$("#input #submitTweet")
					.styledButton({
						"action" : function() { PAL.tweet() }
					});

	$("#menu .searches").styledButton({
		"action" : function () { searches.config() },
		"orientation" : "left"
	});
	$("#menu .groups").styledButton({
		"action" : function () { Groups.config() },
		"orientation" : "center"
	});
	$("#menu .shorten").styledButton({
		"action" : function () { USAL.showUrlForm() },
		"orientation" : "center"
	});
	FHAL.initMenu();
	$("#menu .busy").styledButton({
		"action" : function () { notifier.toggleBusyMode() },
		"orientation" : "center",
		"toggle" : true
	});
	$("#menu .people").styledButton({
		"action" : function () { var people = new People(); people.open() },
		"orientation" : "center"
	});
	$("#menu .settings").styledButton({
		"action" : function () { settings.openInterface() },
		"orientation" : "center"
	});
	$("#menu .plugins").styledButton({
		"action" : function () { pluginLoader.openSettings() },
		"orientation" : "center"
	});
	$("#menu .refresh").styledButton({
		"action" : function () { contentRefresher.manualRefresh() },
		"orientation" : "center"
	});
	
	eventMaster.triggerEvent( eventMaster.INIT_GUI );
	
	$("[title]").qtip({ 
			style: { 
				name: "cream",
				tip: true 
			},
			position : {
				adjust: {
					screen: true
				}
			}
		});
}

$(window).bind('resize', function() {
	var height = mainDisplay.viewHeight();
	$(".tweetPane.displayed").height( height );
	$(".tweetPane.displayed .jScrollPaneContainer").height( height );
	$(".tweetPane.displayed ul").jScrollPane();

	$(".paneMenuContainer").height( height );
	$(".paneMenuContainer .jScrollPaneContainer").height( height );
	$(".paneMenu").jScrollPane({
				showArrows: false,
				scrollBarWidth: 5,
				scrollBarMargin: 0,
				wheelSpeed: 25
			});
});

function addslashes(str)
{
	str=str.replace(/\'/g,'\\\'');
	str=str.replace(/\"/g,'\\"');
	str=str.replace(/\\/g,'\\\\');
	str=str.replace(/\0/g,'\\0');
	return str;
}

function stripslashes(str)
{
	str=str.replace(/\\'/g,'\'');
	str=str.replace(/\\"/g,'"');
	str=str.replace(/\\\\/g,'\\');
	str=str.replace(/\\0/g,'\0');
	return str;
}

function openURI( uri )
{
	var request = new air.URLRequest( uri );
	air.navigateToURL( request );

	return false;
}