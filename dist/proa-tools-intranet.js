/*!
 * Proa Tools Intranet v1.1.0 (https://github.com/proa-data/proa-tools-intranet)
 */

( function() {
angular.module( 'proaTools.intranet', [
	'ngLocale', 'ui.router', 'pascalprecht.translate', 'ngMaterial', 'ui.bootstrap',
	'proaTools.records', 'proaTools.forms'
] );
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.constant( 'DOMAIN', '{{PROA_DOMAIN}}' )
	.constant( 'PT_INTRANET_TEXTS', {
		version: 'Version',
		answer: {
			yes: 'Yes',
			no: 'No'
		}
	} );
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.filter( 'currencyRange', currencyRange )
	.filter( 'answer', answer );

function currencyRange( $locale, currencyFilter ) {
	var SPACE = '\\s*',
		currencySymbolRe = new RegExp( SPACE + '\\' + $locale.NUMBER_FORMATS.CURRENCY_SYM + SPACE, 'g' ),
		rangeSep = $locale.RANGE_SEP;
	return function( nums ) {
		var nums2 = [];
		for ( var i in nums ) {
			nums2[ i ] = currencyFilter( nums[ i ] ).replace( currencySymbolRe, '' );
		}
		return currencyFilter( Infinity ).replace( '\u221E', nums2.join( rangeSep ) );
	};
}

function answer( PT_INTRANET_TEXTS ) {
	return function( bool ) {
		return PT_INTRANET_TEXTS.answer[ bool ? 'yes' : 'no' ];
	};
}
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.value( '$extraLocale', {
		DATETIME_FORMATS: {
			fullShort: 'dd/MM/yyyy HH:mm:ss',
			fullShortDate: 'dd/MM/yyyy',
			fullShortTime: 'HH:mm:ss'
		},
		RANGE_SEP: '-'
	} );
} )();
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
( function() {
angular
	.module( 'proaTools.intranet' )
	.factory( 'getLang', getLang )
	.factory( 'getXhrResponseData', getXhrResponseData );

function getLang( $locale ) {
	return function() {
		return $locale.id.split( '-' ).shift();
	};
}

function getXhrResponseData( $http ) {
	return function( url ) {
		return $http.get( url ).then( function( response ) {
			return response.data;
		} );
	};
}
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.value( '$extraLocale', {
		DATETIME_FORMATS: {
			fullShort: 'MM/dd/yyyy HH:mm:ss',
			fullShortDate: 'MM/dd/yyyy',
			fullShortTime: 'HH:mm:ss'
		},
		RANGE_SEP: '-'
	} );
} )();