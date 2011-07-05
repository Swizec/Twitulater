function AutoCompleteHashTags()
{
	var thisRef = this;
	this.inputId;
	this.hashTagsQueue = new Array();
	this.filter;
	this.run = false;
	this.positionOf = -1;
	
	$("#autoCompleteHashTags li a").live("click", function( event ) {
		thisRef.insertHashTag( $(this) );
	});
	
	$("#myTweet").focus(function () {
		if ( thisRef.run )
 		{
			$("#autoCompleteHashTags").slideDown("slow");
 		}
	});
	
	$("#myTweet").blur(function ( event ) {
		if( thisRef.run ){
			setTimeout( function () {
				$("#autoCompleteHashTags").slideUp("fast");
			}, 100 );
		}
	});
}

AutoCompleteHashTags.prototype.start = function ( inputId )
{
	this.inputId = inputId;
	var text = $(this.inputId).val();
	var ch = text.charAt($(this.inputId)[0].selectionStart-1);
	var textarea = document.getElementById("myTweet");
	if(text.indexOf("#")<0)
	{
		this.run = false;
		$("#autoCompleteHashTags ul").html( "" );
		$("#autoCompleteHashTags").css({"display":"none"});
	}
	if(ch == "#" && !this.run)
	{
		this.positionOf = textarea.selectionStart;
		this.run = true;
	} else if(ch==" ")
	{
		this.run = false;
		$("#autoCompleteHashTags ul").html( "" );
		$("#autoCompleteHashTags").css({"display":"none"});
	}
	if(this.run){
		if(text.indexOf(" ", textarea.selectionStart-1) > -1){
			this.filter = text.substring(this.positionOf, text.indexOf(" ", textarea.selectionStart)+1);
		} else {
			this.filter = text.substring(this.positionOf, text.length);
		}
		this.filterHashTags();
	}
	
}

AutoCompleteHashTags.prototype.filterHashTags = function() 
{
	this.hashTagsQueue = hashTags.filtered( this.filter );
		
	this.display();
}

AutoCompleteHashTags.prototype.display = function()
{	
	$("#autoCompleteHashTags ul").html( "" );
	for ( var i in this.hashTagsQueue )
	{
		$("#autoCompleteHashTags ul").append("<li><a href=\"#\">"+this.hashTagsQueue[ i ]+"</a></li>");
	}
	if(this.hashTagsQueue.length>0)
	{
		$("#autoCompleteHashTags:hidden").slideDown("fast");
		
	} else if(this.hashTagsQueue.length<1)
	{
		$("#autoCompleteHashTags").css({"display":"none"});
	}
	
}

AutoCompleteHashTags.prototype.insertHashTag = function( target )
{	
	var hashTag = target.html();
	myTweet.add(hashTag);
	myTweet.replace(this.filter+hashTag, hashTag + " ");
	$("#autoCompleteHashTags ul").html( "" );
	this.run = false;	
	myTweet.focus();
	$("#autoCompleteHashTags").css({"display":"none"});
}
