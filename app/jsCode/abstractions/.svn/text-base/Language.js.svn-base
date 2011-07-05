function Language()
{
	this.initialised = false;
	this.getDefinitions();

// 	this.definitions = pluginLoader.getPlugin( settings.language() ).definitions;
	
// 	this.replaces( "body" );
}

Language.prototype.getDefinitions = function ()
{
	var language = settings.language();
	
	if ( language == null || language == "null" )
	{
		this.languageSelector();
	}else
	{
		this.definitions = pluginLoader.getPlugin( language ).definitions;
		this.initialised = true;
	}
}

Language.prototype.languageSelector = function ()
{
	$("#menu").hide();
	$("#input").hide();
	$("#tabs").hide();
	$("#languagePicker").show();
	
	var thisRef = this;
	$("#languagePicker a").click( function( event ) {
			var lang = $(this).attr( "class" );
			thisRef.pickerChose( lang );
			event.preventDefault();
			setTimeout( function() { Language.rollbackQuestion() }, 10000 );
	});
}

Language.prototype.pickerClosed = function ( language )
{
	this.definitions = pluginLoader.getPlugin( "english" ).definitions;
	
	Main.initInterface();
}

Language.prototype.pickerChose = function ( language )
{
	settings.addChanged( "language", language );
	settings.save();
	
	Language.definitions = pluginLoader.getPlugin( language ).definitions;
	
	$("#languagePicker").hide();
	$("#menu").show();
	$("#input").show();
	$("#tabs").show();
	
	Main.initInterface();
}

Language.prototype.def = function ( key )
{
	try
	{
		if ( typeof( this.definitions[ key ] ) == "function" )
		{
			return this.definitions[ key ]();
		}else
		{
			return this.definitions[ key ];
		}
	}catch ( e )
	{
		return key;
	}
}

Language.prototype.replaces = function ( parentElement )
{
	var thisRef = this;
	$(parentElement+" l").each( function () {
			$(this).html( thisRef.definitions[ $(this).html() ] );
		} );
		
	$(parentElement+ " [title^='$']").each( function () {
			var key = $(this).attr( "title" )
			
			if ( !key.match( /\$$/ ) )
			{
				return;
			}
			
			key = key.replace( /\$/g, "" );
			
			$(this).attr( "title", thisRef.definitions[ key ] );
		} );
}

Language.prototype.rollbackQuestion = function()
{
	if (confirm("Do you want to keep "+settings.language()+" language?\n"+
				"Zelite obdrzati "+settings.language()+" jezik?\n"+
				"Do ye want t' keep "+settings.language()+" tongue?")==false) 
	{
			settings.addChanged( "language", "null" );
			settings.save();
			window.location.reload();
  	}
}