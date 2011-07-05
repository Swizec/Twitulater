function MyTweet()
{
	var thisRef = this;
	this.inputId = "#myTweet";
	this.autoComplete = undefined ;
	
	$("#myTweet").keyup(function (e){
		thisRef.autoCompletion();
		autoCompleteHashTags.start( thisRef.inputId );
	});
}

MyTweet.prototype.autoCompletion = function ()
{
	if ( this.needNewAutocomplete() )
	{
		this.autoComplete = new AutoComplete();
	}
	
	if ( typeof( this.autoComplete ) != "undefined" )
	{
		this.autoComplete.showList();
	}
}

MyTweet.prototype.needNewAutocomplete = function ()
{
	var text = $(this.inputId).val();
	var ch = text.charAt($(this.inputId)[0].selectionStart-1);
	
	return ch == "@" && typeof( this.autoComplete ) == "undefined"
}

MyTweet.prototype.add = function ( toAdd )
{
	var text = $(this.inputId).val();
	text = text+toAdd;
	$(this.inputId).val( text );

	this.refresh();
}

MyTweet.prototype.replace = function ( needle, replacement )
{
	var text = $(this.inputId).val();
	text = text.replace( needle, replacement );
	$(this.inputId).val( text );

	this.refresh();
}

MyTweet.prototype.value = function ( text )
{
	if ( typeof( text ) == "undefined" )
	{
		return $(this.inputId).val();
	}else
	{
		$(this.inputId).val( text );
		this.refresh();
		return $(this.inputId).val();
	}
}

MyTweet.prototype.empty = function ()
{
	$(this.inputId).val( "" );
	$("#replyToId").val( "" );

	this.refresh();
}

MyTweet.prototype.refresh = function ()
{
	var charLeft = this.charLeft();

	$("#charCount num").html( charLeft );

	if ( charLeft == 140 )
	{
		$("#replyToId").val( "" );
	}

	this.warnTooLong( charLeft );
// 	this.showOrHideShorten( charLeft );
}

MyTweet.prototype.charLeft = function ()
{
	var text = $(this.inputId).val();
	var charLeft = 140-text.length;
	if ( charLeft == "" )
	{
		charLeft = "0";
	}

	return Number( charLeft );
}

MyTweet.prototype.warnTooLong = function ( charLeft )
{
	if ( charLeft <= 0 )
	{
		$(this.inputId).attr( "class", "warning" );
		eventMaster.triggerEvent( eventMaster.TWEET_TOO_LONG );
	}else
	{
		$(this.inputId).attr( "class", "normal" );
		eventMaster.triggerEvent( eventMaster.TWEET_NOT_TOO_LONG );
	}
}

MyTweet.prototype.showOrHideShorten = function ( charLeft )
{
	if ( charLeft <= 0 )
	{
		$("#shrinkTweet").css( "display", "block" );
		$("#twitLonger").css( "display", "block" );
	}else
	{
		$("#shrinkTweet").css( "display", "none" );
		$("#twitLonger").css( "display", "none" );
	}
}

MyTweet.prototype.focus = function ()
{
	$(this.inputId).focusOnEnd();
	mainDisplay.mainWindow.orderToFront();
}

MyTweet.prototype.replyTo = function ( replyId )
{
	$("#replyToId").val( replyId );
}

MyTweet.prototype.getReplyTo = function ()
{
	return $("#replyToId").val();
}