function SearchBundle ( userId )
{
	this.userId = userId;
	this.searches = {};
	this.searchTerms = new Array();
}

SearchBundle.prototype.add = function ( term, type, callback )
{
	if ( typeof( this.searches[ term ] ) == "undefined" )
	{
		this.searchTerms.push( term );
	
		var enabled = this.shouldEnableSearch( term, type );
		
		if ( type == searches.HASHTAG_SEARCH && !enabled )
		{
			return;
		}
		
		this.searches[ term  ] = new Search( this.userId, term, type, enabled );
		this.searches[ term ].store();
		this.searches[ term ].refresh();
		
		if ( typeof( callback ) == "function" )
		{
			callback( this.searches[ term ] );
		}
	}
}

SearchBundle.prototype.remove = function ( term )
{
	this.searches[ term ].remove();
	this.searchTerms.splice( this.searchTerms.indexOf( term ), 1 );
	delete( this.searches[ term ] );
}

SearchBundle.prototype.shouldEnableSearch = function ( term, type )
{
	if ( type == searches.HASHTAG_SEARCH && !settings.autoHashtagSearch() )
	{
		return false;
	}else
	{
		return true;
	}
}

SearchBundle.prototype.refresh = function ()
{
	for ( var i in this.searches )
	{
		this.searches[ i ].refresh();
	}
}

SearchBundle.prototype.getSearches = function ()
{
	return this.searches;
}

SearchBundle.prototype.getSearchTerms = function ()
{
	var terms = new Array();
	for ( var i in this.searchTerms )
	{
		terms.push( this.searchTerms[ i ] );
	}
	return terms;
}

SearchBundle.prototype.getSearch = function ( term )
{
	return this.searches[ term ];
}

SearchBundle.prototype.changeSearchState = function ( term )
{
	this.searches[ term ].changeState();
}
