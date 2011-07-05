function HashTags()
{
	this.hashtags =  {};
}

HashTags.prototype.add = function( hashTag )
{
	if ( !this.contains( hashTag ) )
	{
		this.hashtags[ hashTag.toLowerCase() ] = hashTag;
	}
}

HashTags.prototype.contains = function( hashTag )
{
	return ( typeof( this.hashtags[ hashTag.toLowerCase() ] ) != "undefined" )
}

HashTags.prototype.filtered = function ( hashTag )
{
	var needle = hashTag.toLowerCase();
	var result = new Array();
	
	for ( var k in this.hashtags )
	{
		if ( k.match( needle ) )
		{
			result.push( this.hashtags[k] );
		}
	}
	
	return result.sort();
}