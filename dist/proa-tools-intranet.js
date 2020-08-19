/*!
 * Proa Tools Intranet v2.7.0 (https://github.com/proa-data/proa-tools-intranet)
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
	.module( 'ngMaterial' )
	.directive( 'mdSelect', mdSelect );

function mdSelect( $timeout ) {
	return {
		restrict: 'E',
		compile: compile
	};

	function compile( tElement, tAttrs ) {
		var isMultiple = angular.isDefined( tAttrs.multiple ),
			selectedProp = tAttrs.ngModel,
			elem = tElement.find( 'md-option' ),
			listProp = elem.attr( 'ng-repeat' ).split( 'in' )[ 1 ].split( '|' )[ 0 ],
			idProp = elem.attr( 'ng-value' ).split( '.' )[ 1 ];
		return function( scope ) {
			scope.$watch( listProp, function( array ) {
				var obj = {};
				angular.forEach( array, function( item ) {
					obj[ item[ idProp ] ] = true;
				} );
				var selectedValue = scope.$eval( selectedProp ),
					finalSelectedValue;
				if ( isMultiple ) {
					finalSelectedValue = [];
					angular.forEach( selectedValue, function( value ) {
						if ( value in obj )
							finalSelectedValue.push( value );
					} );
					$timeout( function() {
						scope.$$finalSelectedValue = finalSelectedValue;
						scope.$eval( selectedProp + '=$$finalSelectedValue' );
						delete scope.$$finalSelectedValue;
					} );
				} else if ( !( selectedValue in obj ) )
					scope.$eval( selectedProp + '=undefined' );
			} );
		};
	}
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
}
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.factory( 'getLang', getLang )
	.factory( 'getXhrResponseData', getXhrResponseData )
	.factory( 'dsApi', dsApi ) // DataSnap
	.factory( 'springApi', springApi );

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

function dsApi( $http, $rootScope ) {
	var errorAlert = angular.noop,
		logout = angular.noop,
		path = undefined;

	return {
		setErrorAlert: setErrorAlert,
		setLogout: setLogout,
		setPath: setPath,
		request: getBuiltFn
	};

	function setErrorAlert( fn ) {
		errorAlert = fn;
	}

	function setLogout( fn ) {
		logout = fn;
	}

	function setPath( domain ) {
		path = domain + 'datasnap/rest/TMethods/';
	}

	function getBuiltFn( subpath, params ) {
		return getHttpPromise( subpath, params );
	}

	function getHttpPromise( subpath, params ) {
		var headers = { 'User-Token': $rootScope.userToken },
			userData = $rootScope.userData;
		if ( userData )
			headers[ 'User-Company' ] = userData.id_empresa;
		return $http.post( path + subpath, { _parameters: params || [] }, { headers: headers } ).then( successCallback, errorCallback );

		function successCallback( response ) {
			var responseData = response.data,
				firstData = responseData[ 0 ];
			if ( firstData ) {
				var fields = firstData.fields;
				if ( fields && fields.Fresultado === false ) {
					console.error( fields.Fmensaje );
					errorAlert();
					throw responseData;
				}
			}
			return responseData;
		}

		function errorCallback( response ) {
			var responseData = response.data,
				rde = responseData.error;
			console.error( rde || responseData );
			if ( response.status == 403 || ( rde && rde.includes( 'NOT_VALIDATED' ) ) )
				logout();
			else
				errorAlert();
			throw responseData;
		}
	}
}

function springApi( $rootScope, uibPaginationConfig, $http ) {
	var errorAlert = angular.noop,
		logout = angular.noop,
		path = undefined;

	return {
		setErrorAlert: setErrorAlert,
		setLogout: setLogout,
		setPath: setPath,

		// Requests
		get: getBuiltFn( 'get' ),
		post: getBuiltFn( 'post' ),
		put: getBuiltFn( 'put' ),
		delete: getBuiltFn( 'delete' )
	};

	function setErrorAlert( fn ) {
		errorAlert = fn;
	}

	function setLogout( fn ) {
		logout = fn;
	}

	function setPath( newPath ) {
		path = newPath;
	}

	function getBuiltFn( method ) {
		return function( subpath, params, paginationOptions ) {
			return getHttpPromise( method, subpath, params, paginationOptions );
		};
	}

	function getHttpPromise( method, subpath, params, paginationOptions ) {
		var config = {
			method: method,
			url: path + subpath,
			headers: { 'Authorization': 'Bearer ' + $rootScope.userToken }
		};

		params = params || {};
		if ( paginationOptions ) {
			params.pageLength = uibPaginationConfig.itemsPerPage;
			params.pageNum = paginationOptions.currentPage - 1;
		}
		switch ( method ) {
		case 'get':
		case 'delete':
			config.params = params;
			break;
		case 'post':
		case 'put':
			config.data = params;
		}

		return $http( config ).then( successCallback, errorCallback );

		function successCallback( response ) {
			var responseData = response.data;
			if ( paginationOptions ) {
				paginationOptions.totalItems = responseData.totalElements;
				/*return */paginationOptions.data = responseData.content;
			}
			return responseData;
		}

		function errorCallback( response ) {
			console.error( /*response.status, */response.statusText );
			var responseData = response.data;
			if ( 'message' in responseData )
				console.error( responseData.message );
			if ( response.status == 401 )
				logout();
			else
				errorAlert();
			throw responseData;
		}
	}
}
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.value( '$extraLocale', {
		DATETIME_FORMATS: {
			paddedMedium: 'MM/dd/yyyy HH:mm:ss',
			paddedMediumDate: 'MM/dd/yyyy',
			paddedMediumTime: 'HH:mm:ss',
			paddedShort: 'MM/dd/yyyy HH:mm',
			paddedShortDate: 'MM/dd/yyyy',
			paddedShortTime: 'HH:mm',
			filenameMedium: 'M-d-yyyy H.mm.ss',
			filenameMediumDate: 'M-d-yyyy',
			filenameMediumTime: 'H.mm.ss'
		},
		RANGE_SEP: '-',
		ANSWERS: [
			'No',
			'Yes'
		]
	} );
} )();