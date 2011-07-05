function Services()
{
}

Services.prototype.kill = function ( event )
{
	event.preventDefault();
}

Services.prototype.parseData = function ( params )
{
	var items = new Array();

	for ( var i = 0; i < params.data.length; i++ )
	{
		var tmpItem = new Tweet( params.user, params.data[ i ], params.feed );
		items.push( tmpItem );
	}
	
	return items;
}
