<?php

include( "stats/users.php" );

function newId()
{
	$ids = array_keys( $users );
	sort( $ids );
	$last = intval( array_pop( $ids ) );
	
	return $last+1;
}

$user = ( isset( $_GET[ 'user' ] ) ) ? intval( $_GET[ 'user' ] ) : newId();

if ( !isset( $users[ $user ] ) )
{
	$users[ $user ] = 1;
}else
{
	$users[ $user ]++;
}

file_put_contents( "stats/users.php", '<?php $users = ' . var_export( $users, TRUE ) . ' ?>' );

echo $user;
die();

?>