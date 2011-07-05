function FHAL()
{
	this.handlers = pluginLoader.getPlugins( "fileHandler" );
	for ( var i in this.handlers )
	{
		this.handlers[i].handlerIndex = i;
	}
}

FHAL.prototype.uploadFormSubmit = function ()
{
	var filePath = $("#uploadForm input[name='file']").val();
	var service = $("#uploadForm input[name='service']").val();
	var file = new air.File( filePath );

	this.uploadFileWithService( file, service );
}

FHAL.prototype.uploadFileWithService = function ( file, service )
{
	pluginLoader.getPlugin( service ).upload( file );
}

FHAL.prototype.filesDropped = function ( event )
{
	var fileList = event.dataTransfer.getData("application/x-vnd.adobe.air.file-list");
	
	if ( fileList == null )
	{
		return;
	}

	for ( var i = 0; i < fileList.length; i++ )
	{
		this.uploadFile( fileList[ i ] );
	}
}

FHAL.prototype.uploadFile = function ( file )
{
	for ( var i in this.handlers )
	{
		if ( this.handlers[i].canHandle( file.extension ) )
		{
			this.handlers[i].upload( file );
			return;
		}
	}
}

FHAL.prototype.errorUploading = function ( handlerIndex, file )
{
	handlerIndex = Number( handlerIndex );
	for ( var i = handlerIndex+1; i < this.handlers.length; i++ )
	{
		if ( this.handlers[i].canHandle( file.extension ) )
		{
			notifier.showStatus( Language.def( "upload_retrying" ) );
			this.handlers[i].upload( file );
			return;
		}
	}
	
	notifier.showStatus( Language.def( "upload_error" ) );
}

FHAL.prototype.finishedUploading = function ( uri )
{
	myTweet.add( uri+" " );
	notifier.showStatus( Language.def( "upload_done" ) );
}

FHAL.prototype.uploading = function ( event )
{
	var loaded = event.bytesLoaded;
	var total = event.bytesTotal;
	var percent = Math.ceil( ( loaded / total ) * 100 );
	notifier.showPermanentStatus( Language.def( "upload_uploading" ).replace( /\(%\)/, percent.toString() + " %" ) );
}

FHAL.prototype.initMenu = function ()
{
	for ( var i in this.handlers )
	{
		$("#menu .upload ul").append( "<li val=\""+this.handlers[i].identifier+"\">"+this.handlers[i].displayName+"</li>" );
	}

	$("#menu .upload").styledButton({
		"orientation" : "center",
		"role" : "select",
		"dropdown" : true
	}).change( FHAL.uploadMenuActivated );
}

FHAL.prototype.uploadMenuActivated = function ( event )
{
	$("#uploadForm input[name='service']").val( $(this).val() );
	$("#uploadForm input[name='file']").click();
}