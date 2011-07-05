function Bitly()
{
	this.identifier = "bit.ly";
	this.displayName = "bit.ly";
	this.type = "URIshortener";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "URL shortener using the bit.ly service";
	this.worker = BitlyHelper;
}

Bitly.prototype.getWorker = function ( params )
{
	return new this.worker( params );
}