function AppCloser( mainWindow, openWindows )
{
	this.mainWindow = mainWindow;
	this.closingApp = false;
	this.openWindows = openWindows;
}

AppCloser.prototype.close = function ( )
{
	if ( !this.closingApp )
	{
		this.closingApp = true;
		
		notifier.showFootStatus( Language.def( "closing" ) );
		contentRefresher.stopRefreshing();
		
		var thisRef = this;
		
		this.closeAllWindows();
		
		statistics.reportData( this.finishClosing )
		
		notifier.showFootStatus( Language.def( "closing_almostDone" ) );
// 		this.finishClosing();
	}
}

AppCloser.prototype.closeAllWindows = function ()
{
	for ( var window in this.openWindows )
	{
		try
		{
			this.openWindows[ window ].close();
		}catch ( e )
		{
		}
	}
}

AppCloser.prototype.finishClosing = function ()
{
	notifier.showFootStatus( Language.def( "closing_done" ) );
	air.NativeApplication.nativeApplication.exit();
}