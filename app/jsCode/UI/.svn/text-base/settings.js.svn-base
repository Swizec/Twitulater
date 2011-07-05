function Settings( db )
{
	this.db = db;
	this.settings = {
		defaultShortener : "bit.ly",
		DMinterval : 1800,
		replyInterval : 60,
		searchInterval: 60,
		regularInterval: 36,
		language: null,
		autoHashtagSearch: 0,
	};
	this.changedSettings = {};
	this.readSettings();
}

Settings.prototype.readSettings = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;

	query.text = "SELECT * FROM settings";
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( error )
	{
		air.trace("Error fetching last id:", error);

		return 0;
	}

	result = query.getResult();

	if ( result.data == null )
	{
		return 0;
	}

	for ( var i in result.data )
	{
		this.settings[ unescape( result.data[ i ].name ) ] = unescape( result.data[ i ].value );
	}
}

Settings.prototype.openInterface = function ()
{
	this.changedSettings = new Array();

	var dialog = new Dialog( "Settings" );
	dialog.onWindowInit( function () { settings.setupInterface() } );
	dialog.size({
			"width" : 400,
			"height" : 350
		})
	dialog.open();
}

Settings.prototype.setupInterface = function ()
{
	this.setupShortenerCommands();
	this.setupFrequencyCommands();
	this.setupLanguageCommands();
	this.setupCheckboxCommands();
	this.setupSaveCommands();
}

Settings.prototype.setupShortenerCommands = function ()
{
	$("#dialog .defaultShortener")
		.styledButton({
			"dropdown" : true,
			"role" : "select"
		})
		.change( function () {
			$("#dialog .chosenShortener").html( $(this).val() );
			settings.addChanged( "defaultShortener", $(this).val() );
		})
		.css( "position", "relative" );
	
	$("#dialog .chosenShortener").html( this.defaultShortener() );
}

Settings.prototype.setupLanguageCommands = function ()
{
	var languages = pluginLoader.getPlugins( "language" );
	for ( var i in languages )
	{
		$("#dialog .defaultLanguage ul").append( "<li val=\""+languages[ i ].identifier+"\">"+languages[ i ].displayName+"</li>" );
	}
	
	$("#dialog .defaultLanguage")
		.styledButton({
			"dropdown" : true,
			"role" : "select"
		})
		.change( function () {
			air.trace( $(this).val() );
			$("#dialog .chosenLanguage").html( pluginLoader.getPlugin( $(this).val() ).displayName );
			settings.addChanged( "language", $(this).val() );
		})
		.css( "position", "relative" );
	
	$("#dialog .chosenLanguage").html( pluginLoader.getPlugin( this.language() ).displayName );
}

Settings.prototype.setupFrequencyCommands = function ()
{
	$("#dialog .slider").slider({
		min: 20,
		max: 3600,
		slide: function ( event, ui ) {
			var mins = Math.floor( ui.value/60 );
			var secs = Math.floor( ui.value%60 );
			
			$(this).siblings( ".value" ).html( mins+"m "+secs+"s" );
		},
		change: function ( event, ui ) {
			var mins = Math.floor( ui.value/60 );
			var secs = Math.floor( ui.value%60 );
			var name = $(this).attr( "rel" );
			
			settings.addChanged( name, ui.value );
			
			$(this).siblings( ".value" ).html( mins+"m "+secs+"s" );
		}, 
	});
	
	$("#dialog .slider").not( ".DM" ).slider( "option", "max", 600 );
	
	$("#dialog .DM").slider( "value", this.settings[ "DMinterval" ] );
	$("#dialog .replies").slider("value", this.settings[ "replyInterval" ] );
	$("#dialog .search").slider( "value", this.settings[ "searchInterval" ] );
	$("#dialog .regular").slider( "value", this.settings[ "regularInterval" ] );
}

Settings.prototype.setupCheckboxCommands = function ()
{
	$("#dialog .autoHashtagSearch")
		.styledButton({
			"role" : "checkbox",
			"toggle" : true,
			"checked" : settings.autoHashtagSearch(),
			"checkboxValue" : {
					"on" : 1,
					"off" : 0
				}
		})
		.change( function ( event ) {
				settings.addChanged( "autoHashtagSearch", $(this).val() );
			})
		.css( "position", "relative" );
}

Settings.prototype.setupSaveCommands = function ()
{
	$("#dialog .save")
		.styledButton({
				"action" : function () { $("#dialog form").submit() }
			})
		.css( "position", "relative" );

	$("#dialog form").submit( function () {
		settings.save();
		
		if (confirm(Language.def("settings_saveWarning"))==true) {
  			window.location.reload();
  		}
	
		return false;
	});
}

Settings.prototype.addChanged = function ( setting, value )
{
	this.changedSettings[ setting ] = value;
}

Settings.prototype.save = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = this.db;

	for ( var name in this.changedSettings )
	{
		var value = this.changedSettings[ name ];

		this.settings[ name ] = value;

		query.text = "UPDATE settings SET value='"+escape( value )+"' WHERE name='"+escape( name )+"'";

		try
		{
			query.execute();
		}catch ( e )
		{
			air.trace( e );
			$("#dialogWrapper").css( "display", "none" );
			return;
		}
		
		var result = query.getResult();
		
		if ( result.rowsAffected < 1 )
		{
			query.text = "INSERT INTO settings (value, name)VALUES( '"+escape( value )+"', '"+escape( name )+"')";
			
			try
			{
				query.execute();
			}catch ( e )
			{
				air.trace( e );
				$("#dialogWrapper").css( "display", "none" );
				return;
			}
		}
	}
	
	$("#dialogWrapper").css( "display", "none" );
}

Settings.prototype.defaultShortener = function ()
{
	return this.settings[ "defaultShortener" ];
}

Settings.prototype.DMinterval = function ()
{
	return this.settings[ "DMinterval" ];
}

Settings.prototype.replyInterval = function ()
{
	return this.settings[ "replyInterval" ];
}

Settings.prototype.searchInterval = function ()
{
	return this.settings[ "searchInterval" ];
}

Settings.prototype.regularInterval = function ()
{
	return this.settings[ "regularInterval" ];
}

Settings.prototype.language = function ()
{
	return this.settings[ "language" ];
}

Settings.prototype.autoHashtagSearch = function ()
{
	return (this.settings[ "autoHashtagSearch" ] == 1);
}