<?php

$pagePath = str_replace( "/webby/", "", $_SERVER[ 'REQUEST_URI' ] );
$pagePath = ( empty( $pagePath ) || $pagePath == "/" ) ? 'index' : $pagePath;
$readPath = "pages/${pagePath}.html";

if ( !is_readable( $readPath ) )
{
	$contents = "You're looking for something that isn't here";
	$title = "Error";
}else
{
	$contents = file_get_contents( $readPath );
	switch ( substr( strtolower( $pagePath ), 1 ) )
	{
		case 'changelog':
			$title = 'Twitulater Changelog';
			break;
		case 'history':
			$title = 'Twitulater History';
			break;
		case 'credits':
			$title = 'Twitulater Credits';
			break;
		case 'contact':
			$title = 'Twitulater Contact';
			break;
		case 'download':
			$title = 'Twitulater Download';
			break;
		default:
			$title = 'Twitulater';
	}
}

$siteSkeleton = file_get_contents( 'looks/skeleton.html' );

$html = str_replace( '{$ CONTENT $}', $contents, $siteSkeleton );
$html = str_replace( '{$ TITLE $}', $title, $html );

echo $html;


?>