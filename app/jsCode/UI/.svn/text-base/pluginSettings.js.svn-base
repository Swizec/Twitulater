function PluginSettings()
{
	this.settings = {};
	this.readSettings();
}

PluginSettings.prototype.readSettings = function ()
{
	var store = air.File.applicationStorageDirectory.resolvePath( "pluginSettings.dat" );
	var stream = new air.FileStream();
	
	if ( store.exists )
	{
		stream.open( store, air.FileMode.READ );
		this.settings = stream.readObject();
		stream.close();
	}
}

PluginSettings.prototype.saveSettings = function ()
{
	var store = air.File.applicationStorageDirectory.resolvePath( "pluginSettings.dat" );
	var stream = new air.FileStream();
	
	stream.open( store, air.FileMode.WRITE );
	stream.writeObject( this.settings );
	stream.close();
}

PluginSettings.prototype.isActive = function ( plugin )
{
	var identifier = plugin.identifier;
	
	if ( typeof( this.settings[ identifier ] ) == "undefined" )
	{
		return true;
	}
	
	return this.settings[ identifier ];
}

PluginSettings.prototype.interface = function ()
{
	var dialog = new Dialog( "plugins" );
	
	var thisReference = this;
	dialog.onWindowInit( function () { thisReference.setupInterface() } );
	dialog.onWindowClose( function () { thisReference.saveSettings() } );
	dialog.open();
}

PluginSettings.prototype.setupInterface = function ()
{
	var plugins = pluginLoader.loadedPlugins;
	
	for ( var i in plugins )
	{
		this.addPluginToDialog( plugins[ i ] )
	}
	
	var thisReference = this;
	
	$("#dialog ul").myaccordion();
	$("#dialog li label.state")
			.hover( 
				function () {
					$(this).fadeTo( 100, 0.4 );
				},
				function () {
					$(this).fadeTo( 100, 1.0 );
				} )
			.click( function ( event ) {
					var plugin = $(this).attr( "plugin" );
					var change = $(this).attr( "change" );
					
					thisReference.changePluginState( plugin, change );
					event.stopPropagation();
				});
}

PluginSettings.prototype.addPluginToDialog = function ( plugin )
{
	$("#dialog ul."+plugin.type).append( "<li>"+this.pluginMainInfo( plugin )+"<div class=\"pluginInfo\">"+this.pluginInfo( plugin )+"</div></li>" );
}

PluginSettings.prototype.pluginMainInfo = function ( plugin )
{
	var html = plugin.displayName+" --- ";
	
	if ( this.isActive( plugin ) )
	{
		html += "<label class=\"active state\" change=\"deactivate\" plugin=\""+plugin.identifier+"\">active</label>";
	}else
	{
		html += "<label class=\"deactivated state\" change=\"activate\" plugin=\""+plugin.identifier+"\">deactivated</label>";
	}
	
	return html;
}

PluginSettings.prototype.pluginInfo = function ( plugin )
{
	var html = "";
	html += "<label>Copyright</label> <field>"+plugin.copyright+"</field>";
	html += "<label>Version</label> <field>"+plugin.version+"</field>";
	html += "<label>Description</label> <field>"+plugin.description+"</field>";
	html += "<br /><br />";
	
	return html;
}

PluginSettings.prototype.changePluginState = function ( plugin, change )
{
	if ( change == "activate" )
	{
		this.activatePlugin( plugin );
	}else if ( change == "deactivate" )
	{
		this.deactivatePlugin( plugin );
	}
	
	this.saveSettings();
}

PluginSettings.prototype.activatePlugin = function ( plugin )
{
	this.settings[ plugin ] = true;
	
	$("#dialog label[plugin='"+plugin+"']")
			.css( "color", "green" )
			.removeClass( "deactivated" )
			.addClass( "activate" )
			.attr( "change", "deactivate" )
			.html( "active" );
}

PluginSettings.prototype.deactivatePlugin = function ( plugin )
{
	this.settings[ plugin ] = false;
	
	$("#dialog label[plugin='"+plugin+"']")
			.css( "color", "red" )
			.removeClass( "active" )
			.addClass( "deactivated" )
			.attr( "change", "activate" )
			.html( "deactivated" );
}