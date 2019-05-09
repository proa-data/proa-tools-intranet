/*!
 * Proa Tools Intranet v1.8.3 (https://github.com/proa-data/proa-tools-intranet)
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

function answer( $locale ) {
	var answers = $locale.ANSWERS;
	return function( bool ) {
		return answers[ bool ? 1 : 0 ];
	};
}
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.run( runBlock );

function runBlock( $translate, getLang, $locale, $extraLocale, $mdDateLocale, getXhrResponseData ) {
	$translate.use( getLang() );

	angular.merge( $locale, $extraLocale );

	var datetimeFormats = $locale.DATETIME_FORMATS;
	$mdDateLocale.shortDays = datetimeFormats.SHORTDAY;
	$mdDateLocale.firstDayOfWeek = [ 1, 2, 3, 4, 5, 6, 0 ][ datetimeFormats.FIRSTDAYOFWEEK ];
	var momentDateFormat = datetimeFormats.fullShortDate.replace( /y/g, 'Y' ).replace( /d/g, 'D' );
	$mdDateLocale.formatDate = function( date ) {
		if ( !date )
			return '';
		var localeTime = date.toLocaleTimeString(),
			formatDate = date;
		if ( date.getHours() === 0 && ( localeTime.indexOf( '11:' ) !== -1 || localeTime.indexOf( '23:' ) !== -1 ) )
			formatDate = new Date( date.getFullYear(), date.getMonth(), date.getDate(), 1, 0, 0 );
		return moment( formatDate ).format( momentDateFormat );
	};
	$mdDateLocale.parseDate = function( dateString ) {
		var m = moment( dateString, momentDateFormat, true );
		return m.isValid() ? m.toDate() : new Date( NaN );
	};

	getXhrResponseData( 'about.json' ).then( function( data ) {
		console.info( 'Package: "' + data.name + '" v' + data.version + '.' );
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
		RANGE_SEP: '-',
		ANSWERS: [
			'No',
			'Yes'
		]
	} );
} )();