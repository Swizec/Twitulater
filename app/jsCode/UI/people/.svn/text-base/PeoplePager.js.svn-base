function PeoplePager( params )
{
	this.parentSelector = params.parentSelector;
	this.pageCallback = params.pageCallback;
	this.filterCallback = params.filterCallback;
	this.peopleCount = params.peopleCount;
	this.perPage = params.perPage;
	this.currentPage = 0;
	this.position = params.position;
}

PeoplePager.prototype.display = function ()
{
	var thisRef = this;
	var html = "<div class=\"pager\"><input type=\"text\" class=\"filter\" /><span class=\"info\"></span><br /><span class=\"prev\">"+Language.def( "people_paging_prev" )+"</span><span class=\"next\">"+Language.def( "people_paging_next" )+"</span></div>";
	
	if ( this.position == "bottom" )
	{
		$(this.parentSelector).append( html );
	}else
	{
		$(this.parentSelector).prepend( html );
	}
	$(this.parentSelector+" .pager span").css({
				"font-size" : "10px",
				"padding" : "1px 6px"
			});
	$(this.parentSelector+" .pager .info").css({
				"color": "white",
				"display": "inline-block",
				"font-size": "12px",
				"padding-right": "10px"
			});
	$(this.parentSelector+" .pager .prev")
		.styledButton({
				"orientation" : "left",
				"action" : function () { thisRef.previous() }
			})
		.css( "position", "relative" );
	$(this.parentSelector+" .pager .next")
		.styledButton({
				"orientation" : "right",
				"action" : function () { thisRef.next() }
			})
		.css( "position", "relative" );
	$(this.parentSelector+" .pager input").keyup( function ( event ) { thisRef.filter( event ) } );
		
	this.refresh();
}

PeoplePager.prototype.previous = function ()
{
	this.currentPage -= 1;
	this.refresh();
	this.pageCallback( this.currentPage );
}

PeoplePager.prototype.next = function ()
{
	this.currentPage += 1;
	this.refresh();
	this.pageCallback( this.currentPage );
}

PeoplePager.prototype.filter = function ( event )
{
	this.filterCallback( $(event.target).val() );
}

PeoplePager.prototype.refresh = function ()
{
	this.hideButtons();
	
	$(this.parentSelector+" .pager .info").html( Language.def( "people_paging_displaying" )+" "+this.displayFrom()+" - "+this.displayTo() );
}

PeoplePager.prototype.displayFrom = function ()
{
	return (this.currentPage*this.perPage+1);
}

PeoplePager.prototype.displayTo = function ()
{
	var to = ((this.currentPage+1)*this.perPage);
	
	return ( to > this.peopleCount ) ? this.peopleCount : to;
}

PeoplePager.prototype.hideButtons = function ()
{
	if ( this.currentPage <= 0 )
	{
		$(this.parentSelector+" .pager .prev").css( "display", "none" );
		this.currentPage = 0;
	}else
	{
		$(this.parentSelector+" .pager .prev").css( "display", "inline-block" );
	}
	
	if ( (this.currentPage+1)*this.perPage <= this.peopleCount )
	{
		$(this.parentSelector+" .pager .next").css( "display", "inline-block" );
	}else
	{
		$(this.parentSelector+" .pager .next").css( "display", "none" );
	}
}