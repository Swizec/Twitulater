function Twitter()
{
	this.identifier = "Twitter";
	this.displayName = "Twitter";
	this.type = "protocol";
	this.version = "1.1";
	this.copyright = "Swizec";
	this.description = "Makes sure you can use Twitter";
	this.helpers = {
		"authorisator" : TwitterAuthorisator,
		"poster" : TwitterPoster,
		"reader" : TwitterReader,
		"servicer" : TwitterServicer
	};
}

Twitter.prototype.init = function ()
{
}

Twitter.prototype.authorisator = function ()
{
	return this.getWorker( "authorisator" );
}

Twitter.prototype.poster = function ()
{
	return this.getWorker( "poster" );
}

Twitter.prototype.reader = function ()
{
	return this.getWorker( "reader" );
}

Twitter.prototype.servicer = function ()
{
	return this.getWorker( "servicer" );
}

Twitter.prototype.getWorker = function ( type )
{
	return new this.helpers[ type ]();
}