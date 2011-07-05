function English()
{
	this.identifier = "english";
	this.displayName = "English Language";
	this.type = "language";
	this.version = "1.0";
	this.copyright = "Swizec";
	this.description = "English language support for Twitulater";
	
	this.init();
}

English.prototype.init =  function () {
	this.definitions = {
		"submitTweet" : "Tweet",
		
		"shorten_didYouKnow" : "Did you know any URL used in a tweet will be automatically shortened for you?",
		"shorten_choose" : "Choose service",
		"shorten_shorten" : "Shorten",
		
		"settings_defaultShortener" : "Default URL shorter",
		"settings_refresh" : "Refresh frequencies",
		"settings_refresh_DM" : "DM",
		"settings_refresh_replies" : "Replies",
		"settings_refresh_search" : "Search",
		"settings_refresh_regular" : "Regular",
		"settings_language" : "Language",
		"settings_language_choose" : "Change",
		"settings_save" : "Save",
		"settings_autohashtagsearch" : "Search all hashtags",
		"settings_saveWarning" : "Some changes will only take effect after a restart.\nDo you want to restart now?",
		
		"plugins_protocols" : "Protocols",
		"plugins_shorteners" : "URI shorteners",
		"plugins_filehandlers" : "File uploaders",
		"plugins_languages" : "Languages",
		"plugins_services" : "Services",
		
		"login_username" : "Username",
		"login_password" : "Password",
		"login_automatic" : "Auto login",
		"login_login" : "Login",
		"login_comingSoon" : "Coming soon",
		"login_nopass" : "We don't want your password!<br />After the login window appears just enter the PIN below.",
		"login_PIN" : "PIN",
		"login_welcome" : "",
		
		"tweets_old" : "Old tweets follow",
		
		"category_dm" : "Direct messages",
		"category_reply" : "Replies",
		"category_link" : "Links",
		"category_question" : "Questions",
		"category_happy" : "Happy",
		"category_sad" : "Sad",
		"category_other" : "Chatter",
		"category_rt" : "ReTweets",
		"category_my" : "My Tweets",
		"category_all" : "Everything",
		"category_spam" : "Spam",
		"category_search" : "Search",
		
		"tip_dragdrop" : "You can also drag&amp;drop files here",
		"tip_searches" : "All your searches in one place",
		"tip_groups" : "Group people into logical units",
		"tip_shorten" : "Pesky long URL's need shortening",
		"tip_upload" : "Upload and share files with the world",
		"tip_busy" : "Turn off notifications when they're a distraction",
		"tip_people" : "See all the people you interact with",
		"tip_settings" : "Configure the way things work",
		"tip_plugins" : "Choose the features you use",
		"tip_refresh" : "Refresh the stream right this very instance",
		
		"menu_searches" : "Searches",
		"menu_groups" : "Groups",
		"menu_shorten" : "Shorten URL",
		"menu_upload" : "Upload",
		"menu_busy" : "Busy",
		"menu_people" : "People",
		"menu_settings" : "Settings",
		"menu_plugins" : "Plugins",
		"menu_refresh" : "Refresh",
		
		"koornk_retrieved" : "Retrieved (c) new clucks at (t)",
		"koornk_normal" : "(c) new clucks for (u) on Koornk",
		"koornk_dm" : "(c) new direct messages for (u) on Koornk",
		"koornk_search" : "Found (c) new clucks for (u) on Koornk",
		"koornk_replies" : "(c) new replies for (u) on Koornk",
		
		"twitter_retrieved" : "Retrieved (c) new tweets at (t)",
		"twitter_normal" : "(c) new tweets for (u) on Twitter",
		"twitter_dm" : "(c) new direct messages for (u) on Twitter",
		"twitter_search" : "Found (c) new tweets for (u) on Twitter",
		"twitter_replies" : "(c) new replies for (u) on Twitter",
		
		"retrieve_done" : "Done retrieving",
		
		"closing" : "Closing Twitulater",
		"closing_storing" : "Storing data - (%)",
		"closing_almostDone" : function () {
									var options = [
												"Looking for the Higgs",
												"Putting a man on Mars",
												"Solving the three-body problem",
												"Proving the Riemann hypothesis",
												"Playing with the Poincaré conjecture",
												"Understanding the principle of love",
												"Discovering the fine points of their, they're and there"
											];
											
									return options[Math.floor(Math.random()*options.length)];
								},
		"closing_done" : "Good bye, you will be sorely missed",
		
		"shortening" : "Shortening (uri)",
		
		"upload_retrying" : "Retrying upload",
		"upload_error" : "Error uploading file",
		"upload_done" : "Uploaded file",
		"upload_uploading" : "Uploading - (%)",
		
		"following" : "Following (u)",
		"following_error" : "Error following",
		"unfollowing" : "Unfollowed (u)",
		"unfollowing_error" : "Error unfollowing",
		"blocking" : "Blocking (u)",
		"blocking_error" : "Error blocking",
		"unblocking" : "Unblocked (u)",
		"unblocking_error" : "Error unblocking",
		
		"posting" : "Tweeting ...",
		"posting_koornk" : "Clucking ...",
		"posting_done" : "Tweeted.",
		"posting_done_koornk" : "Clucked.",
		"posting_rateLimit" : "Rate limit exceeded, go have some tea" ,
		"posting_error" : "Something went wrong",
		
		"reading" : "Retrieving tweets",
		"reading_rateLimit" :  "Rate limit exceeded, go for a walk" ,
		"reading_error" : "Something went wrong",
		
		"followers_new" : "(c) new followers: ",
		"followers_new_notification" : "(u) has (c) new followers on (p)",
		"followers_lost" : "(c) lost followers: ",
		"followers_lost_notification" : "(u) lost (c) followers on (p)",
		"followers_error_new" : "Error figuring out which followers are new",
		"followers_error_read" : "Error reading followers list",
		
		"following_new" : "(c) following: ",
		"following_new_notification" : "(u) is following (c) new people on (p)",
		"following_lost" : "(c) unfollowed: ",
		"following_lost_notification" : "(u) unfollowed (c) people on (p)",
		"following_error_new" : "Error figuring out which followings are new",
		"following_error_read" : "Error reading following list",
		
		"blocked_new" : "(c) blocked: ",
		"blocked_new_notification" : "(u) blocked (c) people on (p)",
		"blocked_lost" : "(c) unblocked: ",
		"blocked_lost_notification" : "(u) unblocked (c) people on (p)",
		"blocked_error_new" : "Error figuring out which blocks are new",
		"blocked_error_read" : "Error reading blocked list",
		
		"notification_newFollowers" : "New Followers",
		"notification_lostFollowers" : "Lost Followers",
		"notification_newFollowing" : "Following Anew",
		"notification_lostFollowing" : "Following no More",
		"notification_newMessages" : "New Messages",
		"notification_newDMs" : "New Direct Messages",
		"notification_newReplies" : "New Replies",
		"notification_search" : "New Search Items",
		
		"default_nick" : "unknown",
		"user_suspended" : "suspended",
		
		"people" : "People",
		"people_seen" : "(u) has seen tweets of these (c) people on (p)",
		"people_friends" : "(u) is friends with these (c) people on (p)",
		"people_fans" : "These (c) people are following (u) on (p), but (u) isn't following back",
		"people_following" : "(u) is following these (c) people on (p) who aren't following (u) back",
		"people_blocked" : "(u) has blocked these (c) people on (p)",
		"people_none" : "There are no people to display here",
		"people_cmd_unfollow" : "Unfollow",
		"people_cmd_follow" : "Follow",
		"people_cmd_unblock" : "Unblock",
		"people_cmd_block" : "Block",
		"people_tab_seen" : "Seen",
		"people_tab_friends" : "Friends",
		"people_tab_fans" : "Fans",
		"people_tab_following" : "Following",
		"people_tab_blocked" : "Blocked",
		"people_paging_prev" : "Previous Page",
		"people_paging_next" : "Next Page",
		"people_paging_displaying" : "Displaying",
		
		"profile_read_fail" : "Failed reading profile data",
		"profile_statusCount" : "(c) status updates",
		"profile_following" : "Following (c) people",
		"profile_followers" : "(c) followers",
		
		"filter" : "Filter",
		"filter_displayed" : "(dc)/(tc) displayed",
		
		"searches_enabled" : "Enabled",
		"searches_remove" : "Remove",
		"searches_new" : "New Search",
		"searches_remove_confirm" : "Are you certain you wish to permanently remove (t)?",
		
		"groups_new" : "New group",
		"groups_name" : "Name",
		"groups_save" : "Save",
		"groups_menu" : "Group",
		"groups_saved" : "Saved",
		"groups_remove_confirm" : "Are you certain you wish to permanently remove (g)?",
		
		"updater_warning" : "A newer version is avaliable!",
		"updater_question" : "Do you want to install now?",
		"updater_features" : "Here is a list of some of the new features:",
		
		"bitly_nick" : "Bit.ly requires authentication, please provide your username",
		"bitly_key" : "We also need your API key, found at http://bit.ly/account/",
		"bitly_shortened" : "Shortened ",
	};
}