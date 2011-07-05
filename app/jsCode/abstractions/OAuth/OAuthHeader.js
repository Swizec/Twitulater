function OAuthHeader( params )
{
	this.method = params.method.toUpperCase();
	this.uri = params.uri;
	this.key = params.key;
	this.parameters = new Array();
	this.type = params.type;
}

OAuthHeader.prototype.add = function ( parameter )
{
	this.parameters.push( parameter );
}

OAuthHeader.prototype.generate = function ()
{
	var date = new Date();
	
	this.add( ["oauth_timestamp", Math.floor( date.getTime()/1000 )] );
	this.add( ["oauth_nonce", this.makeNonce()] );
	this.add( ["oauth_version", "1.0"] );
	this.add( ["oauth_signature_method", "HMAC-SHA1"] );
	
	var signature = this.signature();

	this.add( ["oauth_signature", encodeURIComponent( signature )] );
	
	if ( this.type == "HTTPheader" )
	{
		return this.generateHTTPHeader();
	}else if ( this.type == "uri" )
	{
		return this.generateURI();
	}
}

OAuthHeader.prototype.generateHTTPHeader = function ()
{
	var parameters = new Array();
	for ( var i in this.parameters )
	{
		parameters.push( this.parameters[ i ][ 0 ]+"=\""+this.parameters[ i ][ 1 ]+"\"" );
	}
	
	var header = "OAuth realm=\"http://twitter.com\","+parameters.join(",");
	
	return header;
}

OAuthHeader.prototype.generateURI = function ()
{
	var parameters = new Array();
	for ( var i in this.parameters )
	{
		parameters.push( this.parameters[ i ][ 0 ]+"="+this.parameters[ i ][ 1 ] );
	}
	
	return this.uri+"?"+parameters.join("&");
}

OAuthHeader.prototype.makeNonce = function ()
{
	var nonce = "abcdefghijklmnopqrstuvwxyz1234567890";
	
	return nonce.split( "" ).sort( function() {
				return Math.random() < 0.5 ? -1 : 1;
			}).join( "" );
}

OAuthHeader.prototype.signature = function ()
{
	var base = this.generateBaseString();
	
	return this.sign( base );
}

OAuthHeader.prototype.generateBaseString = function ()
{
	var parameters = this.parameters.sort( function ( a, b ) { 
								return ( a.join("=") > b.join("=") ) ? 1 : -1
							});
	var query = new Array();
	for ( var i in parameters )
	{
		query.push( parameters[ i ][0]+"="+encodeURIComponent( parameters[ i ][ 1 ] ) );
	}
	
	var base = this.method+"&"+encodeURIComponent( this.uri )+"&"+encodeURIComponent( query.join( "&" ) );
	
	return base;
}

OAuthHeader.prototype.sign = function ( str )
{
	var hasher = new jsSHA( str, "ASCII" );
	
	return hasher.getHMAC( this.key.join( "&" ), "ASCII", "SHA-1", "B64" )+"=";
}