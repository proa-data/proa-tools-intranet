( function() {
angular
	.module( 'proaTools.intranet' )
	.run( runBlock );

function runBlock( $translate, getLang, $locale, $extraLocale, $mdDateLocale, getXhrResponseData, $rootScope, ptSessionService ) {
	$translate.use( getLang() );

	angular.merge( $locale, $extraLocale );

	var datetimeFormats = $locale.DATETIME_FORMATS;
	$mdDateLocale.shortDays = datetimeFormats.SHORTDAY;
	$mdDateLocale.firstDayOfWeek = [ 1, 2, 3, 4, 5, 6, 0 ][ datetimeFormats.FIRSTDAYOFWEEK ];
	var momentDateFormat = datetimeFormats.paddedShortDate.replace( /y/g, 'Y' ).replace( /d/g, 'D' );
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

	$rootScope.$on( '$stateChangeSuccess', function( event, toState ) {
		var stateName = toState.name,
			translationId = stateName.split( '.' )[ 1 ],
			breadcrumbList = [],
			stateData = toState.data;

		$rootScope.pageTitleTranslationId = getTranslationId( translationId, 'largeTitle' );

		if ( translationId )
			breadcrumbList.push( {
				translationId: getTranslationId( translationId ),
				sref: stateName
			} );
		if ( stateData ) {
			var parentMenu = stateData.parentMenu;
			if ( parentMenu )
				breadcrumbList.unshift( {
					translationId: getTranslationId( parentMenu )
				} );
		}
		$rootScope.breadcrumbList = breadcrumbList;
	} );

	$rootScope.userData = ptSessionService.getUserData();

	function getTranslationId( str, str2 ) {
		return ( str ? str + '.' : '' ) + ( str2 || 'title' );
	}
}
} )();