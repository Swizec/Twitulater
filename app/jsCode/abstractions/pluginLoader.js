function PluginLoader()
{
	this.plugins = {
			"protocol" : new Array(),
			"URIshortener" : new Array(),
			"fileHandler" : new Array(),
			"service" : new Array(),
			"language" : new Array()
		};
	this.pluginsHash = {};
	this.loadedPlugins = new Array();
	this.pluginSettings = new PluginSettings();
}

PluginLoader.prototype.loadPlugins = function ()
{
	this.loadFromApp();
	this.loadFromStorage();
}

PluginLoader.prototype.loadFromApp = function ()
{
	var pluginsDir = air.File.applicationDirectory.resolvePath( "plugins" );

	if ( this.shouldLoadDir( pluginsDir ) )
	{
		this.load( pluginsDir );
	}
}

PluginLoader.prototype.loadFromStorage = function ()
{
	var pluginsDir = air.File.applicationStorageDirectory.resolvePath( "plugins" );

	if ( this.shouldLoadDir( pluginsDir ) )
	{
		this.load( pluginsDir );
	}
}

PluginLoader.prototype.shouldLoadDir = function ( dir )
{
	return dir.exists && dir.isDirectory;
}

PluginLoader.prototype.load = function ( pluginsDir )
{
	var plugins = pluginsDir.getDirectoryListing();

	for ( var i in plugins )
	{
		this.loadPlugin( plugins[ i ] );
	}
}

PluginLoader.prototype.loadPlugin = function ( pluginDir )
{
	if ( this.shouldLoadPlugin( pluginDir ) )
	{
		var files = pluginDir.getDirectoryListing();

		for ( var i in files )
		{
			var file = files[ i ];
			if ( file.extension == "js" )
			{
				this.loadFile( file );
			}
		}

		this.addLoadedPlugin( pluginDir.name );
	}
}

PluginLoader.prototype.shouldLoadPlugin = function ( dir )
{
	return dir.isDirectory && dir.name[0] != '.';
}

PluginLoader.prototype.loadFile = function ( file )
{
	var stream = new air.FileStream();
	stream.open( file, air.FileMode.Read );
	var script = stream.readUTFBytes( stream.bytesAvailable );
	stream.close();
	
	document.write( "<script type=\"text/javascript\">"+script+"</script>" );
}

PluginLoader.prototype.addLoadedPlugin = function ( pluginName )
{
	document.write( "<script type=\"text/javascript\">pluginLoader.loadedPlugins.push( new "+pluginName+"() );</script>" );
}

PluginLoader.prototype.init = function ()
{
	for ( var i in this.loadedPlugins )
	{
		var plugin = this.loadedPlugins[ i ];
		
		if ( this.pluginSettings.isActive( plugin ) )
		{
			this.plugins[ plugin.type ].push( plugin );
			this.pluginsHash[ plugin.identifier ] = plugin;
		}
	}
}

PluginLoader.prototype.getPlugins = function ( type )
{
	return this.plugins[ type ];
}

PluginLoader.prototype.getPlugin = function ( identifier )
{
	return pluginLoader.pluginsHash[ identifier ];
}

PluginLoader.prototype.openSettings = function ()
{
	this.pluginSettings.interface();
}

PluginLoader.prototype.getAllPlugins = function ()
{
	var list = new Array();
	
	return this.loadedPlugins;
}