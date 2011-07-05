function Koornk()
{
	this.identifier = "Koornk";
	this.displayName = "Koornk";
	this.type = "protocol";
	this.version = "1.1";
	this.copyright = "Swizec";
	this.description = "Makes sure you can use Koornk";
	this.helpers = {
		"authorisator" : KoornkAuthorisator,
		"poster" : KoornkPoster,
		"reader" : KoornkReader,
		"servicer" : KoornkServicer
	};
}

Koornk.prototype.authorisator = function ()
{
	return this.getWorker( "authorisator" );
}

Koornk.prototype.poster = function ()
{
	return this.getWorker( "poster" );
}

Koornk.prototype.reader = function ()
{
	return this.getWorker( "reader" );
}

Koornk.prototype.servicer = function ()
{
	return this.getWorker( "servicer" );
}

Koornk.prototype.getWorker = function ( type )
{
	return new this.helpers[ type ];
}