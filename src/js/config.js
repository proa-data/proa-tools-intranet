( function() {
angular
	.module( 'proaTools.intranet' )
	.config( config );

function config( $translateProvider ) {
	$translateProvider
		.useStaticFilesLoader( {
			prefix: 'json/lang/',
			suffix: '.json'
		} )
		.useSanitizeValueStrategy( null );
}
} )();