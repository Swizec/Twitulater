$.fn.focusOnEnd = function ()
{
	var content = $(this).val();
	var domRef = $(this)[0];

	$(this).focus();

	if ( typeof( domRef.createTextRange ) != "undefined" )
	{
		var range = domRef.createTextRange();
		range.collapse(true);
		range.moveEnd('character', domRef);
		range.moveStart('character', domRef);
		range.select();
	} else if ( typeof( domRef.setSelectionRange ) != "undefined" )
	{
		domRef.setSelectionRange( content.length, content.length );
	}
};