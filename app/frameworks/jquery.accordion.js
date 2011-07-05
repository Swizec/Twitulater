jQuery.fn.myaccordion = function ()
{
	return $(this).each( function () {
		var menu = jQuery(this);
		
		menu.children().each( function () {
			var menuEntry = jQuery(this);
			var entities = menuEntry.children();
			
			menuEntry.click( function ( event ) {
					var entry = $(this);
					
					if ( entry.children( "div" ).is( ":visible" ) )
					{
						entry.parent().children().each( function () {
							$(this).children( "div:visible" ).slideUp( "fast" );
						});
					}else
					{
						entry.siblings().each( function () {
							$(this).children( "div:visible" ).slideUp( "fast" );
						});
						entry.children( "div" ).slideDown( "fast" );
					}
				});
			menuEntry.children( "div" ).css( "display", "none" );
		} );
	} );
}