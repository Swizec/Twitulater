function English_pirate()
{
	this.identifier = "pirate";
	this.displayName = "English (pirate)";
	this.type = "language";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "English language support for Twitulater";
	
	this.init();
}

English_pirate.prototype.init =  function () {
	this.definitions = {
		"submitTweet" : "Arrr!",
		
		"shorten_didYouKnow" : "Know ye any anchor stabbed in yer arrr will be cut?",
		"shorten_choose" : "Make yer choice!",
		"shorten_shorten" : "Slash!",
		
		"settings_defaultShortener" : "Captain slasher",
		"settings_refresh" : "How often be ye readin'",
		"settings_refresh_DM" : "Privarrr",
		"settings_refresh_replies" : "Parlay",
		"settings_refresh_search" : "Seek",
		"settings_refresh_regular" : "Plain",
		"settings_language" : "Tongue",
		"settings_save" : "Arrr",
		"settings_autohashtagsearch" : "Seek all marks",
		"settings_saveWarning" : "Some of ya changes will take effect after restart.\nDo ye want t' restart now?",

		
		"plugins_protocols" : "Disputations",
		"plugins_shorteners" : "Anchor slashers",
		"plugins_filehandlers" : "Keggers",
		"plugins_languages" : "Tongues",
		"settings_language_choose" : "Mangle tongue",
		"plugins_services" : "Grog",
		
		"login_username" : "Yer name",
		"login_password" : "Yer key",
		"login_automatic" : "Mind t' key",
		"login_login" : "Arrr",
		"login_comingSoon" : "Over t' horizon",
		"login_nopass" : "We care not fer yer secret key!<br />Wait fer thar quest'n t' appear and give us yer PIN",
		"login_PIN" : "PIN",
		"login_welcome" : "",
		
		"tweets_old" : "Old canarries",
		
		"category_dm" : "Quiet parlay",
		"category_reply" : "Parlay",
		"category_link" : "Anchors",
		"category_question" : "Inquests",
		"category_happy" : "Jolly",
		"category_sad" : "Sorry louts",
		"category_other" : "Nonsense",
		"category_rt" : "Rearrrgh",
		"category_my" : "Me treasure",
		"category_all" : "Salty breeze",
		"category_spam" : "Spam",
		"category_search" : "Seek",
		
		"tip_dragdrop" : "Ye can throw chunks o' treasure 'ere",
		"tip_searches" : "Scroll o' what ye seek",
		"tip_groups" : "Join yer mateys into crews that make sense",
		"tip_shorten" : "Cut them long anchors short!",
		"tip_upload" : "Spend treasure with all louts who dare",
		"tip_busy" : "Shut the land lubber up to let ye work",
		"tip_people" : "All yer lootin' mateys be 'ere",
		"tip_settings" : "Man the sails and swap the deck",
		"tip_plugins" : "More guns an' masts fer yer frigate!",
		"tip_refresh" : "Threat' th' cleark for all yer disputes",
		
		"menu_searches" : "Seekin'",
		"menu_groups" : "Crews",
		"menu_shorten" : "Cut anchor",
		"menu_upload" : "Spend",
		"menu_busy" : "Shut up!",
		"menu_people" : "Mateys",
		"menu_settings" : "Sails",
		"menu_plugins" : "Masts",
		"menu_refresh" : "ARR!",
		
		"koornk_retrieved" : "(c) arrrr at (t)",
		"koornk_normal" : "(c) fresh arrr for (u) on Koornk",
		"koornk_dm" : "(c) quiet parlay for (u) on Koornk",
		"koornk_search" : "Caught (c) canarrrries (u) on Koornk",
		"koornk_replies" : "(c) parlay for (u) on Koornk",
		
		"twitter_retrieved" : "(c) arrrr at (t)",
		"twitter_normal" : "(c) fresh arrrr for (u) on Twitter",
		"twitter_dm" : "(c) quiet parlay for (u) on Twitter",
		"twitter_search" : "Caught (c) canarrrries (u) on Twitter",
		"twitter_replies" : "(c) parlay for (u) on Twitter",
		
		"retrieve_done" : "Th' lootin' be finished",
		
		"closing" : "Killin' Twitulater",
		"closing_storing" : "Savin' treasure - (%)",
		"closing_almostDone" : function () {
									var options = [
												"Chasin' wenches",
												"Scourin' fer loot",
												"Going to Tortuga",
												"Roping turtles with hair off me back",
												"Becomin' Errol Flynn",
												"Drinkin' grog",
											];
											
									return options[Math.floor(Math.random()*options.length)];
								},
		"closing_done" : "So long!",
		
		"shortening" : "Cuttin' (uri)",
		
		"upload_retrying" : "Sharin' again",
		"upload_error" : "Sharin' gone wrong",
		"upload_done" : "Sharrred!",
		"upload_uploading" : "Sharin' - (%)",
		
		"following" : "Stalking (u)",
		"following_error" : "Stalking gone wrong",
		"unfollowing" : "Endin' stalking (u)",
		"unfollowing_error" : "Error endin' stalking",
		"blocking" : "Blindin' (u)",
		"blocking_error" : "Error blindin'",
		"unblocking" : "Unblindin' (u)",
		"unblocking_error" : "Error unblindin'",
		
		"posting" : "Arrr ...",
		"posting_koornk" : "Arrr ...",
		"posting_done" : "Arrr!.",
		"posting_done_koornk" : "Arrr!.",
		"posting_rateLimit" : "Ye be shouting too much! Shut up" ,
		"posting_error" : "Terrible thing capt'n",
		
		"reading" : "Lootin'",
		"reading_rateLimit" :  "Ye be listenin' too much an' no-one's talkin'" ,
		"reading_error" : "Terrible thing capt'n",
		
		"followers_new" : "(c) fresh stalkers: ",
		"followers_new_notification" : "(u) got (c) land lubbing stalkers on (p)",
		"followers_lost" : "(c) dead stalkers: ",
		"followers_lost_notification" : "(u) slayed (c) stalkers on (p)",
		"followers_error_new" : "Trouble tellin' what stalker is a land lubbing lout",
		"followers_error_read" : "All yer stalkers be hidin' behind wench's skirts",
		
		"following_new" : "(c) fresh stalkings: ",
		"following_new_notification" : "(u) be stalking (c) victims on (p)",
		"following_lost" : "Finish'd stalking (c): ",
		"following_lost_notification" : "(u) no more be stalking (c) victims on (p)",
		"following_error_new" : "Trouble tellin' whom yer stalkin'",
		"following_error_read" : "All yer victims be hidin'",
		
		"blocked_new" : "(c) blinded: ",
		"blocked_new_notification" : "(u) blinded (c) sorry louts on (p)",
		"blocked_lost" : "(c) unblinded: ",
		"blocked_lost_notification" : "(u) unblinded (c) mateys on (p)",
		"blocked_error_new" : "Trouble tellin' who is blind afresh",
		"blocked_error_read" : "Blind fellows be hidin'",
		
		"notification_newFollowers" : "Fresh stalkers",
		"notification_lostFollowers" : "Dead stalkers",
		"notification_newFollowing" : "Fresh stalkings",
		"notification_lostFollowing" : "Dead stalkings",
		"notification_newMessages" : "Fresh arrr",
		"notification_newDMs" : "Quiet Parlay",
		"notification_newReplies" : "Parlay",
		"notification_search" : "Caught Canarrrries",
		
		"default_nick" : "ninja",
		"user_suspended" : "hung!",
		
		"people" : "Scallywags",
		"people_seen" : "(u) be heard them (c) scoundrels on (p)",
		"people_friends" : " These (c) scallywags be mateys to (u) on (p)",
		"people_fans" : "These (c) sorry louts think (u) care for their words, but (u) don't",
		"people_following" : "(u) be stalking these (c) scoundrels (p) who heed not a word (u) says",
		"people_blocked" : "(u) blinded these (c) sorry louts on (p)",
		"people_none" : "Thar be no scallywags to show",
		"people_cmd_unfollow" : "End stalkin'",
		"people_cmd_follow" : "Stalk",
		"people_cmd_unblock" : "Make see",
		"people_cmd_block" : "Blind",
		"people_tab_seen" : "Spotted",
		"people_tab_friends" : "Mateys",
		"people_tab_fans" : "Louts",
		"people_tab_following" : "Swashbucklers",
		"people_tab_blocked" : "Blind",
		"people_paging_prev" : "Th' scroll before",
		"people_paging_next" : "Th' scroll ahead",
		"people_paging_displaying" : "Showin'",
		
		"profile_read_fail" : "Trouble lootin' corpse",
		"profile_statusCount" : "(c) screams",
		"profile_following" : "Stalking (c) swashbucklers",
		"profile_followers" : "(c) stalkers",
		
		"filter" : "Pick 'n' choose",
		"filter_displayed" : "(dc) of (tc) seen",
		
		"searches_enabled" : "Workin'",
		"searches_remove" : "Keelhaul",
		"searches_new" : "Make Seek",
		"searches_remove_confirm" : "Ye sure won't seek (t) no more?",
		
		"groups_new" : "Fresh crew",
		"groups_name" : "Name",
		"groups_save" : "Arrr",
		"groups_menu" : "Crew",
		"groups_saved" : "Arrrr!",
		"groups_remove_confirm" : "Ye sure want crew (g) no more?",
		
		"updater_warning" : "A newer version be here!",
		"updater_question" : "Do ye want t' install now?",
		"updater_features" : "Here be a list o' some o' th' new features:",
		
		"bitly_nick" : "Bit.ly wants to know who ye be, give us yer nick",
		"bitly_key" : "We also be needin' yer API key! Seek it at http://bit.ly/account/",
		"bitly_shortened" : "Cut ",
	};
}