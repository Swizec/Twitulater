$(document).ready( function() {
// 	$("#content")
// 	$("#content").jScrollPane({showArrows: true, wheelSpeed: 25 });
});

jQuery(function($) {
	$('ul.gallery').galleria({
	history   : false, // activates the history object for bookmarking, back-button etc.
			clickNext : true, // helper for making the image clickable
			insert    : '#main_image', // the containing selector for our main image
			onImage   : function(image,caption,thumb) { // let's add some image effects for demonstration purposes

				// fade in the image & caption
				if(! ($.browser.mozilla && navigator.appVersion.indexOf("Win")!=-1) ) { // FF/Win fades large images terribly slow
					image.css('display','none').fadeIn(1000);
				}
				caption.css('display','none').fadeIn(1000);

				// fetch the thumbnail container
				var _li = thumb.parents('li');

				// fade out inactive thumbnail
				_li.siblings().children('img.selected').fadeTo(500,0.3);

				// fade in active thumbnail
				thumb.fadeTo('fast',1).addClass('selected');

				// add a title for the clickable image
				image.attr('title','Next image >>');
			},
			onThumb : function(thumb) { // thumbnail effects goes here

				// fetch the thumbnail container
				var _li = thumb.parents('li');

				// if thumbnail is active, fade all the way.
				var _fadeTo = _li.is('.active') ? '1' : '0.3';

				// fade in the thumbnail when finnished loading
				thumb.css({display:'none',opacity:_fadeTo}).fadeIn(1500);

				// hover effects
				thumb.hover(
					function() { thumb.fadeTo('fast',1); },
					function() { _li.not('.active').children('img').fadeTo('fast',0.3); } // don't fade out if the parent is active
				)
			}
		});
		
	$.galleria.activate( "/gallery/1.png");


	$("ul#menu li a").css({
		'padding' : '4px 20px',
		'font-size' : '16px'
	});
	$("ul#menu li.left a").styledButton({
		"orientation" : "left"
	});
	$("ul#menu li.center a").styledButton({
		"orientation" : "center"
	});
	$("ul#menu li.right a").styledButton({
		"orientation" : "right"
	});
	
	$("ul#minimenu li a").css({
		'padding' : '2px 10px',
		'font-size' : '12px'
	});
	$("ul#minimenu li.left a").styledButton({
		"orientation" : "left"
	});
	$("ul#minimenu li.center a").styledButton({
		"orientation" : "center"
	});
	$("ul#minimenu li.right a").styledButton({
		"orientation" : "right"
	});
	
	$(".getnow").css({
		'padding' : '5px 25px',
		'font-size' : '20px',
		'font-weight' : 'bold'
	}).styledButton();
});