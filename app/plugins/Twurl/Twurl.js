function Twurl()
{
	this.identifier = "twurl.cc";
	this.displayName = "twurl.cc";
	this.type = "URIshortener";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "URL shortener using the twurl.cc service";
	this.worker = TwurlHelper;
}

Twurl.prototype.getWorker = function ( params )
{
	return new this.worker( params );
}

function TwurlHelper( params )
{
	this.uri = params.uri;
	this.callback = params.callback;
	this.sentParams = params;
}

TwurlHelper.prototype.shorten = function ()
{
	var loader = new air.URLLoader();
	var request = new air.URLRequest( "http://twurl.cc/index/twurl" );
	var variables = new air.URLVariables();

	variables.url = this.uri;
	request.data = variables;
	request.method = air.URLRequestMethod.POST;

	var thisReference = this;
	loader.addEventListener( air.Event.COMPLETE, function (event) { thisReference.readAndReturnURI( event ) } );

	try
	{
		loader.load( request );
	}catch( e )
	{
	}
}

TwurlHelper.prototype.readAndReturnURI = function ( event )
{
	var uri = this.readURI( event );
	this.callback( uri, this.sentParams );
}

TwurlHelper.prototype.readURI = function ( event )
{
	var loader = air.URLLoader( event.target );
	loader.dataFormat = air.URLLoaderDataFormat.TEXT;

	var parser = new DOMParser();
	var htmlDoc = parser.parseFromString( loader.data, "text/xml" );

	var uri = htmlDoc.getElementById( "twurl" ).value;

	notifier.showStatus( "Shortened URI" );

	return uri;
}