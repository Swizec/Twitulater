function Tweet( user, node, feed )
{
	this.feed = feed;
	this.toUser = user;
	this.type = "";
	this.protocol = twitulaterUser.getUser( user ).protocol;

	if ( feed == "dm" )
	{
		this.time = node.created_at;
		this.id = node.id;
		this.text = node.text;
		this.source = "";
		this.reply_to_id = "";
		this.reply_to_user = "";
		this.poster = new TweetPoster( node.sender, user );
	}else if ( feed.match( "search" ) )
	{
		this.time = node.created_at;
		this.id = node.id;
		this.text = node.text;
		this.source = "Search";
		this.reply_to = null;
		this.reply_to_user = null;
		this.reply_to_id = node.in_reply_to_status_id;
		this.poster = new TweetPoster( node, user );
	}else
	{
		this.time = node.created_at;
		this.id = node.id;
		this.text = node.text;
		this.source = node.source;
		this.reply_to_id = node.in_reply_to_status_id;
		this.reply_to_user = node.in_reply_to_screen_name;
		this.poster = new TweetPoster( node.user, user );
	}

	this.uriRegEx = /(http|https|ftp)([^ ]+)/ig;
	
	if ( !feed.match( "search" ) )
	{
		this.store();
	}
}

Tweet.prototype.store = function ()
{
	var query = new air.SQLStatement();
	query.sqlConnection = dataStorage.db;
	query.text = "INSERT INTO tweets"+
			"(id, user, poster, time, text, source, reply_to_id, reply_to_user)VALUES"+
			"( '"+this.id+"', '"+this.toUser+"', '"+this.poster.id+"', '"+this.time+"', '"+escape( this.text )+"', '"+escape( this.source )+"', '"+Number( this.reply_to_id )+"', '"+this.reply_to_user+"' )";
	query.addEventListener( air.SQLEvent.RESULT, function ( event ) {} );
	query.addEventListener( air.SQLErrorEvent.ERROR, dataStorage.sqlErrorHandler );

	try
	{
		query.execute();
	}catch ( e )
	{
	}
}

Tweet.prototype.toHTML = function ()
{
	var time = this.getDisplayTime();
	var emphasis = this.getEmphasis();

	html = "<li class=\"id_"+this.id+" replyto_"+this.reply_to_id+" tweet\">";
	html += "<img src=\""+this.poster.avatar+"\" />";
	html += this.tweetMenu();
	html += "<block>";
	html += "<p style=\"background-color: rgba( 233, 232, 0, "+emphasis+" )\">"+this.parseTweetText( this.text )+"</p>";
	html += "<label>"+this.posterToAnchor()+", "+time+" via "+this.anchorsToOutLinks( this.source )+this.getReplyTo()+"</label>";
	html += "</block>";
	html += "</li>";

	return html;
}

Tweet.prototype.getDisplayTime = function ()
{
	var date = new Date( this.time );
	datePart = date.toDateString().replace( date.getFullYear(), "" );
	timePart = date.toLocaleTimeString();

	return datePart+" "+timePart;
}

Tweet.prototype.getEmphasis = function ()
{
	var score = emphases.getScore( this.poster.id, this.toUser );
	// TODO: probably shouldn't follow a linear scale
	return score;
}

Tweet.prototype.tweetMenu = function ()
{
	html = "<div class=\"tweetMenu\">";
	html += "<a href=\"\" pid=\""+this.poster.id+"\" name=\""+this.poster.nick+"\" replyId=\""+this.id+"\" class=\"reply\" type=\"reply\" content=\""+escape( this.text )+"\" onclick=\"return false\">@</a>";
	html += "<a href=\"\" pid=\""+this.poster.id+"\" name=\""+this.poster.nick+"\" replyId=\""+this.id+"\" class=\"rt\" type=\"rt\" content=\""+escape( this.text )+"\"  onclick=\"return false\">RT</a>";
	html += "<a href=\"\" pid=\""+this.poster.id+"\" name=\""+this.poster.nick+"\" replyId=\""+this.id+"\" class=\"dm\"type=\"dm\"  onclick=\"return false\">DM</a>";
	html += "</div>";

	return html;
}

Tweet.prototype.parseTweetText = function ( text )
{
	text = this.urisToAnchor( text );
	text = this.atrepliesToAnchor( text );

	return text;
}

Tweet.prototype.urisToAnchor = function ( text )
{
	return text.replace( this.uriRegEx, '<a href="$1$2" rel="outLink" pid="'+this.poster.id+'" name="'+this.poster.nick+'" type="linkClick">$1$2</a>' );
}

Tweet.prototype.atrepliesToAnchor = function ( text )
{
	var parser = XRegExp.cache( "@([a-zA-Z0-9_]+)", "g" );
	var atreplies = text.match( parser );

	if ( atreplies == null )
	{
		return text;
	}

	for ( var i = 0; i < atreplies.length; i++ )
	{
		text = text.replace( atreplies[ i ], "<a href=\""+PAL.usernameURI( atreplies[ i ].substring( 1 ), this.toUser )+"\" rel=\"posterLink\" id=\""+atreplies[ i ].substring( 1 )+"\">"+atreplies[ i ]+"</a>" );
	}
	return text;
}

Tweet.prototype.anchorsToOutLinks = function ( text )
{
	return text.replace( /href="(.+)"/, 'href="$1" rel="outLink"' );
}

Tweet.prototype.posterToAnchor = function ()
{
	var uri = PAL.usernameURI( this.poster.nick, this.toUser );
	return "<a href=\""+uri+"\" rel=\"posterLink\" id=\""+this.poster.nick+"\">"+this.poster.nick+"</a>";
}

Tweet.prototype.getReplyTo = function ()
{
	if ( this.reply_to_id == null || this.reply_to_id == 0 )
	{
		return "";
	}

// 	var uri = PAL.replyToURI( { "toUser": this.reply_to_user, "toId": this.reply_to_id }, this.toUser );
// 	var replyToText = " <a href=\""+uri+"\" rel=\"outLink\">in reply to "+this.reply_to_user+"</a>";
	var replyToText = " <a href=\"\" rel=\"replyLink\" tweetId=\""+this.id+"\" userId=\""+this.toUser+"\">in reply to "+this.reply_to_user+"</a>";

	return replyToText;
}

Tweet.prototype.getTweetType = function ()
{
	if ( this.type == "" )
	{
		this.type = this.getTweetTypeInternal();
	}

	return this.type;
}

Tweet.prototype.getTweetTypeInternal = function ()
{
	if ( this.isMine() )
	{
		return "myTweets";
	}else if ( this.isDM() )
	{
		return "dmTweets";
	}else if ( this.isReply() )
	{
		return "replyTweets";
	}else if ( this.isSpam() )
	{
		return "spamTweets";
	}else if ( this.isManualSearch() )
	{
		return this.feed.replace( ":", "_" )+"Tweets";
	}else if ( this.isHashTagged() )
	{
		return "hashtagged";
	}else if ( this.isRT() )
	{
		return "rtTweets";
	}else if ( this.isLink() )
	{
		return "linkTweets";
	}else if ( this.isQuestion() )
	{
		return "questionTweets";
	}else if ( this.isHappy() )
	{
		return "happyTweets";
	}else if ( this.isSad() )
	{
		return "sadTweets";
	}else
	{
		return "otherTweets";
	}
}

Tweet.prototype.isMine = function ()
{
	re = new RegExp( twitulaterUser.getUser( this.toUser ).username, "i" );
	return this.poster.nick.match( re );
}

Tweet.prototype.isReply = function ()
{
	var re = new RegExp( ".*@"+twitulaterUser.getUser( this.toUser ).username, "i" );
	return this.text.match( re ) || this.isAnnouncement();
}

Tweet.prototype.isAnnouncement = function ()
{
	return this.poster.nick == "twitulaterApp" && this.text.match( /#annc/ );
}

Tweet.prototype.isHashTagged = function ()
{
	var re = new XRegExp.cache( /#\p{L}+/ );

	return re.test( this.text );
}

Tweet.prototype.isRT = function ()
{
	var re = new XRegExp.cache( /(^(rt|retweet|re-tweet|rp)(ing){0,1}([: ])*.*|via[ ]+@\p{L}+)/i );
	
	return re.test( this.text );
}

Tweet.prototype.isLink = function ()
{
	return this.text.match( /.*http:\/\/.*/i );
}

Tweet.prototype.isQuestion = function ()
{
	return this.text.indexOf( "?" ) > -1;
}

Tweet.prototype.isHappy = function ()
{
	return this.text.match( /:\)|:-\)|:D|:-D/ );
}

Tweet.prototype.isSad = function ()
{
	return this.text.match( /:\(|:-\(/ );
}

Tweet.prototype.isSpam = function ()
{
	return this.text.match( /#magpie.*/ ) || this.checkRepeat();
}

Tweet.prototype.isDM = function ()
{
	return this.feed == "dm";
}

Tweet.prototype.isManualSearch = function ()
{
	return this.feed.match( "search:" );
}

Tweet.prototype.hashTags = function ()
{
	var parser = XRegExp.cache( /^#\p{L}+/ );
	var words = this.text.split( /\p{Z}+/ );
	var tags = new Array();

	for ( var i = 0; i < words.length; i++ )
	{
		if ( parser.test( words[ i ] ) )
		{
			tags.push( parser.exec( words[ i ] ) );
		}
	}

	return tags;
}

Tweet.prototype.checkRepeat = function ()
{
	var lastFew = dataStorage.lastFewTweets( this.toUser );
	var text = dataStorage.removeRTgarbage( this.text );

	for ( i = 0; i < lastFew.length; i++ )
	{
		if ( lastFew[ i ] == text )
		{
			return true;
		}
	}

	return false;
}

Tweet.prototype.activate = function ( parentSelector )
{
	var tweetType = this.produceTweetType();

	var thisRef = this;
	$(".id_"+this.id+" a[rel='posterLink']").click( function ( event ) {
			var id = $(this).attr( "id" );
			if ( id == "" )
			{
				id = thisRef.poster.id;
			}
	
			var profile = new ProfileDisplay( id );
			profile.open();
			event.preventDefault();
		});
	$(".id_"+this.id+" a[rel='outLink']").click( mainDisplay.linkClickHandler );
	$(".id_"+this.id+" a[rel='replyLink']").click( PAL.conversationThread );

	for ( var i in tweetType )
	{
		var type = tweetType[ i ].replace( "#", "" );
		
		if ( $(parentSelector+".id_"+this.id+":visible").size() > 0 )
		{
			air.trace( parentSelector+".id_"+this.id+" .tweetMenu" );
			mainDisplay.initTweetMenus( parentSelector+".id_"+this.id+" .tweetMenu" );
		}
	}
}

Tweet.prototype.produceTweetType = function ()
{
	var tweetType = Array( this.getTweetType() );

	if ( tweetType[ 0 ] == "hashtagged" )
	{
		tweetType = Array();
		var tags = this.hashTags();

		for ( var i = 0; i < tags.length; i++ )
		{
			tweetType.push( "tag"+tags[ i ]+"Tweets" );
		}
	}

	return tweetType;
}

Tweet.prototype.activateInConversation = function ( display )
{
//	$(display.document).find(".id_"+this.id+" a[rel='outLink']").click( mainDisplay.linkClickHandler );
	var thisRef = this;
	$(display.document).find(".id_"+this.id+" a[rel='outLink']")
				.click( function ( event ) {
						parent.mainDisplay.linkClickHandler( event );
//						for ( var i in parent )
//						{
//							air.trace( i+"::"+parent[ i ] );
//						}
//						$(parent.document).find( ".id_"+thisRef.id+" a[href='"+$(this).attr("href")+"']").eq(0).click();
						event.preventDefault();
					});
	$(display.document).find(".id_"+this.id+" a[rel='replyLink']").click( function ( event ) { event.preventDefault() } );
	
	mainDisplay.initTweetMenus( ".id_"+this.id+" div[class='tweetMenu']", display );
}