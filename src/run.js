( function() {
angular
	.module( 'proaTools.intranet' )
	.run( runBlock );

function runBlock( $translate, getLang, $locale, $extraLocale, getXhrResponseData, PT_INTRANET_TEXTS ) {
	$translate.use( getLang() );

	angular.merge( $locale, $extraLocale );

	getXhrResponseData( 'about.json' ).then( function( data ) {
		console.log( PT_INTRANET_TEXTS.version + ': ' + data.version );
	} );
}
} )();