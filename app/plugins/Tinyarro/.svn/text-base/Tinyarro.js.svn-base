function Tinyarro()
{
	this.identifier = "tinyarro.ws";
	this.displayName = "tinyarro.ws";
	this.type = "URIshortener";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "URL shortener using the tinyarro.ws service";
	this.worker = TinyarroHelper;
}

Tinyarro.prototype.getWorker = function ( params )
{
	return new this.worker( params );
}

function TinyarroHelper( params )
{
	this.uri = params.uri;
	this.callback = params.callback;
	this.sentParams = params;
}

TinyarroHelper.prototype.shorten = function ()
{
	var loader = new air.URLLoader();
	var request = new air.URLRequest( "http://tinyarro.ws/api-create.php" );
	var variables = new air.URLVariables();
	variables.url = this.uri;

	request.data = variables;
	request.method = air.URLRequestMethod.GET;

	var thisReference = this;
	loader.addEventListener( air.Event.COMPLETE, function (event) { thisReference.readAndReturnURI( event ) } );

	try
	{
		loader.load( request );
	}catch( e )
	{
	}
}

TinyarroHelper.prototype.readAndReturnURI = function ( event )
{
	var uri = this.readURI( event );
	this.callback( uri, this.sentParams );
}

TinyarroHelper.prototype.readURI = function ( event )
{
	var loader = air.URLLoader( event.target );
	var url = loader.data;

	url = url.replace( "&#x27A1;", "➡" );

	notifier.showStatus( "Shortened to "+url );


	return url;
}