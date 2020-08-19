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