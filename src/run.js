( function() {
angular
	.module( 'proaTools.intranet' )
	.run( runBlock );

function runBlock( $locale, $extraLocale, getXhrResponseData, PT_INTRANET_TEXTS ) {
	angular.merge( $locale, $extraLocale );

	getXhrResponseData( 'about.json' ).then( function( data ) {
		console.log( PT_INTRANET_TEXTS.version + ': ' + data.version );
	} );
}
} )();