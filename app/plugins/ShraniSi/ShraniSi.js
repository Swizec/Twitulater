function ShraniSi()
{
	this.identifier = "shrani.si";
	this.displayName = "shrani.si";
	this.type = "fileHandler";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "Uploads almost any type of file to shrani.si";
	this.extensions = {
		"3g2": true, "3gp": true, "avi": true, "bmp": true, "doc": true, "docx": true, "gif": true, "jpe": true, "jpeg": true, "jpg": true, "m4v": true, "mid": true, "mov": true, "mp4": true, "mpeg": true, "mpg": true, "odp": true, "ods": true, "odt": true, "pdf": true, "png": true, "pps": true, "ppt": true, "pptx": true, "psd": true, "rtf": true, ".swf": true, "sxc": true, "sxi": true, "sxw": true, "tga": true, "tif": true, "tiff": true, "wmv": true, "xls": true, "xlsx": true, "zip": true
	};
	this.handlerIndex = 0;
	this.file = {};
}

ShraniSi.prototype.upload = function ( file )
{
	this.file = file;
	var workFile = new air.File( file.nativePath );
	
	var url = "http://shrani.si/nalozimini.php";
	var postingUser = twitulaterUser.activeUser();

	var variables = new air.URLVariables();

	var tmpRequest = new air.URLRequest(url);
	tmpRequest.method = air.URLRequestMethod.POST;
	tmpRequest.contentType = 'multipart/form-data';
	tmpRequest.data = variables;
	air.sendToURL(tmpRequest);

	var thisReference = this;
	workFile.addEventListener(air.ProgressEvent.PROGRESS, function (event) { FHAL.uploading( event )});
	workFile.addEventListener(air.DataEvent.UPLOAD_COMPLETE_DATA, function (event) { thisReference.uploaded( event )});
	workFile.addEventListener(air.IOErrorEvent.IO_ERROR, function ( event ) { FHAL.errorUploading( thisReference.handlerIndex, thisReference.workFile ) } );

	workFile.upload(tmpRequest, 'datoteka', false);
}

ShraniSi.prototype.uploaded = function ( event )
{
	$("#uploadForm input[name='picture']").val( "" );

	var returnData = event.data;

	if ( returnData.match( /div id='info'/ ) )
	{
		var regex = RegExp( /\[url=(.+?)\]/ );
		var fileUri = regex.exec( returnData )[ 1 ];
		
		FHAL.finishedUploading( fileUri );
	}else
	{
		FHAL.errorUploading( this.handlerIndex, this.file );
	}
}

ShraniSi.prototype.canHandle = function ( extension )
{
	if ( typeof( this.extensions[ extension ] ) != "undefined" && this.extensions[ extension ] == true )
	{
		return true;
	}

	return false;
}