function AutoComplete()
{
	this.nick = "";
	this.apperanceOfAt = false;
	this.positionOf = 0;
	this.peopleList = new PeopleListDisplay({
			"type" : "all",
			"user" : twitulaterUser.activeUser(),
			"db" : dataStorage.db,
			"parentSelector" : "#autoComplete",
			"display" : "minimal",
	});
	this.peopleList.perPage = 8;
	this.peopleList.displayPeoplePager = false;
	var thisRef = this;

	$("#autoComplete").slideDown("slow");
	
	$("#autoComplete li").live("click", function( event ) {
		thisRef.insertNick( $(this) );
	});
	
	$("#myTweet").blur(function () {
		 setTimeout( function () {
				$("#autoComplete:visible").slideUp("fast");
			}, 100 );
	});
	
	$("#myTweet").focus(function () {
// 		if ( typeof( thisRef.autoComplete ) != "undefined" )
// 		{
			$("#autoComplete").slideDown("slow");
// 		}
	});
}

AutoComplete.prototype.showList = function()
{
	var textarea = document.getElementById("myTweet");
	textarea.focus();
	var text = $("#myTweet").val();
	var ch = text.charAt(textarea.selectionStart-1);
	$("#autoComplete ul").html( "" );
	if(text.indexOf("@")<0){
		this.apperanceOfAt = false;	
		//delete(this.autoComplete);
		this.kill();
	}
	if(ch=="@" && !this.apperanceOfAt){
		this.nick = "";
		this.apperanceOfAt = true;
		this.peopleList.display();
		this.positionOf = textarea.selectionStart;
	} else if(ch==" "){
		this.apperanceOfAt = false;
		
		this.kill();
	}
	if(this.apperanceOfAt){
		if(text.indexOf(" ", textarea.selectionStart-1) > -1){
			this.nick = text.substring(this.positionOf, text.indexOf(" ", textarea.selectionStart)+1);
		} else {
			this.nick = text.substring(this.positionOf, text.length);
		}
		$("#autoComplete ul").html( "" );
		this.peopleList.filterDisplay(this.nick);
	}
}

AutoComplete.prototype.insertNick = function( target )
{	
	this.kill();
	var nick2 = target.find("strong").html();
	myTweet.add(nick2);
	myTweet.replace(this.nick+nick2, nick2 + " ");
	$("#autoComplete ul").html( "" );
	this.apperanceOfAt = false;	
	myTweet.focus();
	//delete(this.autoComplete);
	//this.kill();
}

AutoComplete.prototype.kill = function ()
{
	$("#autoComplete li").die();
	$("#myTweet")
		.unbind( "blur" )
		.unbind( "focus" );
	
	myTweet.autoComplete = undefined;
	//$("#autoComplete").css({"display":"none"});
	$("#autoComplete ul").html( "" );
	$("#autoComplete:visible").slideUp(1);
	//$("#autoComplete").css({"display":"none"});
	$("#autoComplete ul").html( "" );
}