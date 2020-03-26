( function() {
angular
	.module( 'proaTools.intranet' )
	.factory( 'getLang', getLang )
	.factory( 'getXhrResponseData', getXhrResponseData )
	.factory( 'dsApi', dsApi ); // DataSnap

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

function dsApi( $http, $rootScope, uibPaginationConfig ) {
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
		return $http.post( path + subpath, { _parameters: params || [] }, { headers: { 'User-Token': $rootScope.userToken } } ).then( successCallback, errorCallback );

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
} )();