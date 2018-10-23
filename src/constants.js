( function() {
angular
	.module( 'proaTools.intranet' )
	.constant( 'DOMAIN', '{{PROA_DOMAIN}}' )
	.constant( 'PT_INTRANET_TEXTS', {
		version: 'Version'
	} );
} )();