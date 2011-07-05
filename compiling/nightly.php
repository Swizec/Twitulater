<?php

$descriptor = file_get_contents( "descriptor.xml" );

$descriptor = str_replace( '</id>', '-nightly</id>', $descriptor );
$descriptor = str_replace( '</filename>', '-nightly</filename>', $descriptor );
$descriptor = str_replace( '</version>', date( 'dmY' ) . '</version>', $descriptor );

file_put_contents( "descriptor.xml", $descriptor );

?>