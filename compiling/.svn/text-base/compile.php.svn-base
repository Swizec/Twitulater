<?php

print_R( $argv );

$descriptor = file_get_contents( "descriptor.xml" );

$descriptor = preg_replace( "#<version>.+?</version>#", "<version>" . $argv[ 1 ] . "</version>", $descriptor );

file_put_contents( "descriptor.xml", $descriptor );

?>