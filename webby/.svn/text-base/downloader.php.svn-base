<?php

$filePath = $_GET[ 'file' ];
$pathParts = pathinfo( $filePath );

if ( ( $pathParts[ 'extension' ] != 'air' && $pathParts[ 'extension' ] != 'dmg' && $pathParts[ 'extension' ] != 'zip' ) || !is_readable( $filePath ))
{
	die();
}


include( "stats/downloads.php" );
if ( !isset( $stats[ $filePath ] ) )
{
	$stats[ $filePath ] = 0;
}
$stats[ $filePath ] = $stats[ $filePath ]+1;
file_put_contents( "stats/downloads.php", '<?php $stats = ' . var_export( $stats, TRUE ) . '; ?>' );


$fsize = filesize( $filePath );

if ( $pathParts[ 'extension' ] == 'air' )
{
	header( "Content-type: application/vnd.adobe.air-application-installer-package+zip.air" );
}else if ( $pathParts[ 'extension' ] == 'dmg' )
{
	header( "Content-type: application/x-apple-diskimage" );
}else if ( $pathParts[ 'extension' ] == 'zip' )
{
	header( "Content-type: application/octet-stream" );
}
header( "Content-Disposition: attachment; filename=\"" . $pathParts[ 'basename' ] . "\"" );
header( "Content-length: $fsize" );
header( "Cache-control: private" );

readfile( $filePath );
exit;

?>