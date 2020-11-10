( function() {
angular
	.module( 'proaTools.intranet' )
	.controller( 'PtLoginController', PtLoginController )
	.controller( 'PtMainController', PtMainController )
	.controller( 'PtModalController', PtModalController );

function PtLoginController( $scope, ptSessionService, ptApiService, $rootScope, ptOpenProfileModal, dataService, $state ) {
	$scope.loginData = {};
	$scope.selectCompany = false;
	$scope.submit = submit;
	$scope.submitWithCompany = submitWithCompany;

	activate();

	function activate() {
		ptSessionService.logout();
	}

	function submit() {
		ptApiService.doLogin( $scope.loginData.user, md5( $scope.loginData.pw ) ).then( function( data ) {
			if ( data ) {
				ptSessionService.start( data );
				var userData = $rootScope.userData;
				if ( userData && userData.validado ) {
					$scope.requiredUpdatePassword = false;
					if ( $scope.loginData.user == $scope.loginData.pw ) {
						ptOpenProfileModal( 1 ).then( function( answer ) {
							if ( answer )
								getCompanies();
							else
								$scope.requiredUpdatePassword = true;
						} );
					} else
						getCompanies();
				} else {
					if ( userData === undefined )
						$scope.errorServer = true;
					else
						$scope.notPermiss = true;
				}
			} else {
				if ( data === undefined )
					$scope.errorServer = true;
				else
					$scope.notPermiss = true;
			}
		} );
	}

	function submitWithCompany() {
		if ( $rootScope.userData.id_empresa != 0 ) {
			angular.forEach( $scope.companyItems, function( company ) {
				if ( company.id == $rootScope.userData.id_empresa )
					$rootScope.userData.id_oficina = company.officeCode;
			} );
			ptSessionService.start( $rootScope.userData );
			goToHome();
		}
	}

	function getCompanies() {
		dataService.getCompanies().then( function( data ) {
			if ( data ) {
				$scope.companyItems = data;
				if ( $scope.companyItems.length == 1 ) {
					$rootScope.userData.id_empresa = $scope.companyItems[ 0 ].id;
					$rootScope.userData.id_oficina = $scope.companyItems[ 0 ].officeCode;
					ptSessionService.start( $rootScope.userData );
					goToHome();
				} else
					$scope.selectCompany = true;
			} else
				$scope.errorServer = true;
		} );
	}

	function goToHome() {
		$state.go( 'main.home' );
	}
}

function PtMainController( $scope, $rootScope, ptSessionService, ptScreens, ptApiService, ptOpenProfileModal ) {
	$scope.navList = [];

	var displays = {};
	$scope.isDisplayed = isDisplayed;

	$scope.logout = logout;
	$scope.openModal = openModal;

	activate();

	function activate() {
		var userData = $rootScope.userData;
		if ( !ptSessionService.isUserAuthorized() || ( userData === null ) ) {
			logout();
			return;
		}
		if ( !( userData.nif && userData.email ) )
			openModal();

		$scope.navList = ptScreens;

		var list = [];
		angular.forEach( ptScreens, function( obj ) {
			var submenu = obj.submenu;
			if ( submenu )
				angular.forEach( submenu, function( obj2 ) {
					obj2 = angular.copy( obj2 );
					obj2.parent = obj.name;
					list.push( obj2 );
				} );
			else
				list.push( obj );
		} );

		var permissionsList = {};
		angular.forEach( list, function( obj ) {
			permissionsList[ obj.permission ] = 1;
		} );
		permissionsList = _.keys( permissionsList );
		ptApiService.checkPermissions( permissionsList.join() ).then( function( data ) {
			if ( data ) {
				var permissions = data[ 0 ].permisos;

				var userData = ptSessionService.getUserData();
				userData.permisos = permissions;
				ptSessionService.setUserData( userData );

				angular.forEach( permissions, function( obj ) {
					angular.forEach( list, function( obj2 ) {
						if ( obj.recurso == obj2.permission ) {
							var isVisible = !!obj.visualizar;
							displays[ obj2.name ] = isVisible;
							if ( isVisible ) {
								var parent = obj2.parent;
								if ( parent )
									displays[ parent ] = true;
							}
						}
					} );
				} );
			}
		} );
	}

	function isDisplayed( obj ) {
		return displays[ obj.name ];
	}

	function logout() {
		ptSessionService.logout();
	}

	function openModal() {
		ptOpenProfileModal();
	}
}

function PtModalController( $rootScope, $scope, modalTabIndex, $mdDialog, dsApi, ptSessionService, ptApiService ) {
	var userData = $rootScope.userData;

	$scope.modalTabIndex = modalTabIndex;
	$scope.closeDialog = closeDialog;
	$scope.data = {
		nif: userData.nif,
		email: userData.email
	};
	$scope.isNoUserData = isNoUserData;
	$scope.saveData = saveData;
	$scope.saveNewPassword = saveNewPassword;
	$scope.submittedResetPassword = false;
	$scope.photoContent = userData.contenido_foto;
	$scope.getNewImage = getNewImage;
	$scope.processNewImage = processNewImage;

	function closeDialog() {
		$mdDialog.hide();
	}

	function isNoUserData() {
		var data = $scope.data;
		return !( data.nif && data.email );
	}

	function saveData() {
		var data = angular.copy( $scope.data );
		dsApi.request( 'GuardarDatosUsuario', [ userData.id_usuario, data ] ).then( function() {
			userData.nif = data.nif;
			userData.email = data.email;
			ptSessionService.setUserData( userData );
			closeDialog();
		} );
	}

	function saveNewPassword() {
		$scope.submittedResetPassword = true;
		$scope.failSameNewPassword = false;
		$scope.failOldPassword = false;
		$scope.emptyNewPassword = false;
		var id_usuario = userData.id_usuario;
		if ( $scope.resetPasswordForm == null )
			$scope.emptyNewPassword = true;
		else {
			var old_password = $scope.resetPasswordForm.current_password,
				new_password = $scope.resetPasswordForm.new_password,
				repeat_new_password = $scope.resetPasswordForm.repeat_new_password;
			if ( new_password !== repeat_new_password )
				$scope.failSameNewPassword = true;
			else if ( new_password == null )
				$scope.emptyNewPassword = true;
			else {
				ptApiService.resetPassword( id_usuario, md5( old_password ), md5( new_password ) ).then( function( data ) {
					var success = data;
					if ( success[ 0 ] == true )
						closeDialog( success[ 0 ] );
					else
						$scope.failOldPassword = true;
				} );
			}
		}
	}

	function getNewImage() {
		document.getElementById( 'input-new-image' ).click();
		$scope.invalidQRCode = false;
		$scope.isRequired = false;
		$scope.noResultsVehicle = false;
		$scope.vehicleNumberNew = '';
	}

	function processNewImage( target ) {
		$scope.errorUpdatingPicture = false;
		var id_usuario = userData.id_usuario,
			files = target.files,
			reader = new FileReader();
		reader.onload = function() {
			var dataUri = reader.result;
			ptApiService.updateUserPicture( id_usuario, dataUri ).then( function( data ) {
				var response = data;
				if ( response[0].fields.Fresultado == true ) {
					var contentDataUri = dataUri.substring( dataUri.indexOf( ',' ) + 1 );
					userData.ruta_foto = response[ 0 ].fields.Fmensaje;
					userData.contenido_foto = contentDataUri;
					ptSessionService.setUserData( userData );
					document.getElementById( 'profileImage' ).src = dataUri;
				} else
					$scope.errorUpdatingPicture = true;
			} );
		};
		reader.readAsDataURL( files[ 0 ] );
	}
}
} )();