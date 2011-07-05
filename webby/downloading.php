<?php

$rootPath = str_replace( 'download.php', '', $_SERVER[ 'PHP_SELF' ] );
$filePath = str_replace( $rootPath, '', $_SERVER[ 'REQUEST_URI' ] );
$filePath = substr( $filePath, 1 );

include( "stats/downloads.php" );
if ( !isset( $stats[ $filePath ] ) )
{
	$stats[ $filePath ] = 0;
}
$stats[ $filePath ] += 1;
file_put_contents( "stats/downloads.php", '<?php ' . var_export( $stats, TRUE ) . '; ?>' );

$siteSkeleton = file_get_contents( 'looks/empty.html' );

$content = "<h2>Thank you for downloading Twitulater!</h2><p>If you have any issues please don't be afraid to ask @Swizec or @twitulaterApp</p>";
$content .= "<iframe src=\"downloader.php?file=$filePath\" style=\"display: none\" /></iframe>";

$html = str_replace( '{$ CONTENT $}', $content, $siteSkeleton );
$html = str_replace( '{$ TITLE $}', 'Downloading Twitulater', $html );

echo $html;

?>