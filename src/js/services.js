( function() {
angular
	.module( 'proaTools.intranet' )
	.factory( 'getLang', getLang )
	.factory( 'getXhrResponseData', getXhrResponseData )
	.factory( 'dsApi', dsApi ) // DataSnap
	.factory( 'springApi', springApi )
	.factory( 'ptApiService', ptApiService )
	.factory( 'ptSessionService', ptSessionService )
	.factory( 'ptOpenProfileModal', ptOpenProfileModal );

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

function dsApi( $http, ptSessionService, $rootScope ) {
	var errorAlert = angular.noop,
		path = undefined;

	return {
		setErrorAlert: setErrorAlert,
		setPath: setPath,
		request: getBuiltFn
	};

	function setErrorAlert( fn ) {
		errorAlert = fn;
	}

	function setPath( domain ) {
		path = domain + 'datasnap/rest/TMethods/';
	}

	function getBuiltFn( subpath, params ) {
		return getHttpPromise( subpath, params );
	}

	function getHttpPromise( subpath, params ) {
		var headers = { 'User-Token': ptSessionService.getToken() },
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
				ptSessionService.logout();
			else
				errorAlert();
			throw responseData;
		}
	}
}

function springApi( ptSessionService, uibPaginationConfig, $http ) {
	var errorAlert = angular.noop,
		path = undefined;

	return {
		setErrorAlert: setErrorAlert,
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
			headers: { 'Authorization': 'Bearer ' + ptSessionService.getToken() }
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
				ptSessionService.logout();
			else
				errorAlert();
			throw responseData;
		}
	}
}

function ptApiService( dsApi, $rootScope ) {
	return {
		doLogin: doLogin,
		checkPermissions: checkPermissions,
		getExtraUserData: getExtraUserData,
		resetPassword: resetPassword,
		updateUserPicture: updateUserPicture
	};

	function doLogin( username, pw ) {
		return dsApi.request( 'ValidarUsuario', [ username, pw ] ).then( function( data ) {
			return data[ 0 ];
		} );
	}

	function checkPermissions( resources ) {
		return dsApi.request( 'ObtenerPermisos', [ $rootScope.userData.id_usuario, resources ] );
	}

	function getExtraUserData( username ) {
		return dsApi.request( 'ObtenerDatosUsuario', [ username ] ).then( function( data ) {
			return data[ 0 ];
		} );
	}

	function resetPassword( username, oldPw, newPw ) {
		return dsApi.request( 'CambiarPassword', [ username, oldPw, newPw ] );
	}

	function updateUserPicture( username, imgContent ) {
		return dsApi.request( 'ActualizarFotoUsuario', [ username, imgContent ] );
	}
}

function ptSessionService( $window, $rootScope, $state ) {
	var STORAGE_KEYS = {
			token: 'ptToken',
			userData: 'ptUserData'
		},
		storage = $window.localStorage;

	return {
		start: start,
		isUserAuthorized: isUserAuthorized,
		setUserData: setUserData,
		getUserData: getUserData,
		getToken: getToken,
		logout: logout
	};

	function start( userData ) {
		setUserData( userData );
		storage.setItem( STORAGE_KEYS.token, userData.token );
	}

	function isUserAuthorized() {
		return getToken() !== null;
	}

	function setUserData( userData ) {
		storage.setItem( STORAGE_KEYS.userData, angular.toJson( userData ) );
		$rootScope.userData = userData;
	}

	function getUserData() {
		var userData = storage.getItem( STORAGE_KEYS.userData );
		if ( userData !== null )
			return angular.fromJson( userData );
		return null;
	}

	function getToken() {
		return storage.getItem( STORAGE_KEYS.token );
	}

	function logout() {
		storage.clear();
		delete $rootScope.userData;
		$state.go( 'login' );
	}
}

function ptOpenProfileModal( $mdDialog, PT_TEMPLATES ) {
	return function( tabIndex ) {
		return $mdDialog.show( {
			template: PT_TEMPLATES.modal,
			controller: 'PtModalController',
			locals: { modalTabIndex: tabIndex || 0 }
		} );
	};
}
} )();