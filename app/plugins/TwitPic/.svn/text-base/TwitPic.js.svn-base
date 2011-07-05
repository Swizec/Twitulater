function TwitPic()
{
	this.identifier = "twitPic";
	this.displayName = "twitPic";
	this.type = "fileHandler";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "Uploads images to twitpic.com";
	this.extensions = {
		"bmp": true, "jpg": true, "jpeg": true, "png": true, "gif": true, "tiff": true, "tif": true, "raw": true, "ppm": true, "pgm": true, "pb": true, "pnm": true
	};
	this.handlerIndex = 0;
	this.file = {};
}

TwitPic.prototype.upload = function ( file )
{
	this.file = file;
	var workFile = new air.File( file.nativePath );
	
	var url = "http://twipic.com/api/upload";
	var postingUser = twitulaterUser.activeUser();

	var variables = new air.URLVariables();
	variables.username = postingUser.username;
	variables.password = postingUser.password;

	var tmpRequest = new air.URLRequest(url);
	tmpRequest.method = air.URLRequestMethod.POST;
	tmpRequest.contentType = 'multipart/form-data';
	tmpRequest.data = variables;
	air.sendToURL(tmpRequest);

	var thisReference = this;
	workFile.addEventListener(air.ProgressEvent.PROGRESS, function (event) { FHAL.uploading( event )});
	workFile.addEventListener(air.DataEvent.UPLOAD_COMPLETE_DATA, function (event) { thisReference.uploaded( event )});
	workFile.addEventListener(air.IOErrorEvent.IO_ERROR, function ( event ) { FHAL.errorUploading( thisReference.handlerIndex, thisReference.workFile ) } );

	workFile.upload(tmpRequest, 'media', false);
}

TwitPic.prototype.uploaded = function ( event )
{
	$("#uploadForm input[name='picture']").val( "" );

	var returnData = event.data;

	if ( returnData.match( /rsp stat="ok"/ ) )
	{
		var regex = RegExp( /<mediaurl>(.+)<\/mediaurl>/ );
		var picUri = regex.exec( returnData )[ 1 ];

		FHAL.finishedUploading ( picUri );
	}else
	{
		FHAL.errorUploading( this.handlerIndex, this.file );
	}
}

TwitPic.prototype.canHandle = function ( extension )
{
	if ( typeof( this.extensions[ extension ] ) != "undefined" && this.extensions[ extension ] == true )
	{
		return true;
	}

	return false;
}