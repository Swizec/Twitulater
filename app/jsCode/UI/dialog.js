function Dialog( dialogName )
{
	this.content = this.getContent( dialogName );
	this.title = dialogName;
	this.initWindow = "";
	this.closeWindow = "";
	this.size({
			"width" : 400,
			"height" : 300
		});
}

Dialog.prototype.getContent = function ( dialogName )
{
	var filePath = "app:/dialogs/"+dialogName+".html";
	var dialog = new air.File( filePath );
	var dialogStream = new air.FileStream();

	dialogStream.open( dialog, air.FileMode.READ );
	var content = "";

	try
	{
		content = dialogStream.readUTFBytes( dialogStream.bytesAvailable );
	}catch( e )
	{
	}

	dialogStream.close();

	return content;
}

Dialog.prototype.setTitle = function ( title )
{
	this.title = title;
}

Dialog.prototype.onWindowInit = function ( callback )
{
	this.initWindow = callback;
}

Dialog.prototype.size = function ( size )
{
	$("#dialog").width( size.width )
			.height( size.height );
	$("#dialog content").width( size.width-10 )
			.height( size.height-50 );
}

Dialog.prototype.onWindowClose = function ( callback )
{
	this.closeWindow = callback;
}

Dialog.prototype.open = function()
{
	$("#dialog content").html( this.content );
	$("#dialog .title").html( this.title );

	$("#dialogWrapper").css("display", "block");

// 	$("#dialog content").jScrollPane({
// 			showArrows: false,
// 			scrollBarWidth: 5,
// 			scrollBarMargin: 0,
// 			wheelSpeed: 25
// 		})
	$("#dialog").css({
			"left" : $(window).width()/2-$("#dialog").width()/2,
			"top" : $(window).height()/2-$("#dialog").height()/2
		});
	
	if ( typeof( this.closeWindow ) == "function" )
	{
		var thisReference = this;
		
		$("#dialog .close").styledButton({
			"action" : function () {
				thisReference.closeWindow();
				$("#dialogWrapper").css( "display", "none" )
			}
		});
	}else
	{
		$("#dialog .close").styledButton({
			"action" : function () {
				$("#dialogWrapper").css( "display", "none" )
			}
		});
	}
	
	Language.replaces( "#dialog" );

	if ( typeof( this.initWindow ) == "function" )
	{
		this.initWindow();
	}
}