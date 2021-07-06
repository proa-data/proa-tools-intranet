/*!
 * Proa Tools Intranet v5.0.0 (https://github.com/proa-data/proa-tools-intranet)
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
	.constant( 'PT_TEMPLATES', {
		login: '<div class="container" id="container-login">' +
				'<div>' +
					'<img class="img-responsive center-block" src="img/logo.png">' +
					'<h1 class="h3 text-center" translate="largeTitle"></h1>' +
					'<form class="form-horizontal" ng-submit="submit()">' +
						'<div class="form-group">' +
							'<label class="col-sm-4 control-label" translate="login.user"></label>' +
							'<div class="col-sm-8">' +
								'<input type="text" class="form-control" ng-model="loginData.user" required>' +
							'</div>' +
						'</div>' +
						'<div class="form-group">' +
							'<label class="col-sm-4 control-label" translate="login.password"></label>' +
							'<div class="col-sm-8">' +
								'<input type="password" class="form-control" ng-model="loginData.pw" required>' +
							'</div>' +
						'</div>' +
						'<div class="form-group" ng-if="selectCompany">' +
							'<label class="col-sm-4 control-label" translate="login.company"></label>' +
							'<div class="col-sm-8">' +
								'<select class="form-control" ng-model="$root.userData.id_empresa" ng-options="item.id as item.name for item in companyItems" ng-change="submitWithCompany()"></select>' +
							'</div>' +
						'</div>' +
						'<button type="submit" class="btn btn-primary btn-block" translate="login.login"></button>' +
					'</form>' +
					'<p class="alert alert-danger" ng-show="notPermiss" translate="login.error.noLogin"></p>' +
					'<p class="alert alert-danger" ng-show="requiredUpdatePassword" translate="login.error.update_password_required"></p>' +
					'<p class="alert alert-danger" ng-show="errorServer" translate="login.error.server"></p>' +
				'</div>' +
			'</div>',
		main: '<header>' +
				'<nav class="navbar navbar-default">' +
					'<div class="container-fluid">' +
						'<div class="navbar-header">' +
							'<button type="button" class="navbar-toggle collapsed" ng-click="isNavCollapsed=!isNavCollapsed">' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
								'<span class="icon-bar"></span>' +
							'</button>' +
							'<div class="navbar-brand" ng-if="$root.userData.logo_contenido">' +
								'<img ng-src="data:image/png;base64,{{$root.userData.logo_contenido}}">' +
							'</div>' +
						'</div>' +
						'<div class="navbar-collapse" uib-collapse="isNavCollapsed">' +
							'<ul class="nav navbar-nav">' +
								'<li uib-dropdown class="pull-right">' +
									'<a href="" uib-dropdown-toggle role="button">' +
										'<img class="img-responsive img-circle" ng-src="data:image/jpeg;base64,{{$root.userData.contenido_foto}}" onerror="this.onerror=null;this.src=\'img/default-avatar.jpg\'">' +
										' ' +
										'<span class="caret"></span>' +
									'</a>' +
									'<ul class="dropdown-menu">' +
										'<li class="dropdown-header">{{$root.userData.nombre}} ({{$root.userData.id_usuario}})</li>' +
										'<li role="separator" class="divider"></li>' +
										'<li><a href="" ng-click="openModal()"><span class="fas fa-user fa-fw"></span> <span translate="manageUser.title_dropdown"></span></a></li>' +
										'<li><a href="" ng-click="logout()"><span class="fas fa-power-off fa-fw"></span> <span translate="manageUser.logout_dropdown"></span></a></li>' +
									'</ul>' +
								'</li>' +
								'<li uib-dropdown ng-repeat-start="item in navList" ng-if="isDisplayed(item)&&item.submenu">' +
									'<a href="" uib-dropdown-toggle>' +
										'<span ng-include="\'nav-content.html\'"></span>' +
										' ' +
										'<span class="caret"></span>' +
									'</a>' +
									'<ul uib-dropdown-menu>' +
										'<li ui-sref-active="active" ng-include="\'nav-link.html\'" ng-repeat="item in item.submenu" ng-if="isDisplayed(item)"></li>' +
									'</ul>' +
								'</li>' +
								'<li ui-sref-active="active" ng-include="\'nav-link.html\'" ng-repeat-end ng-if="isDisplayed(item)&&!item.submenu"></li>' +
							'</ul>' +
						'</div>' +
					'</div>' +
				'</nav>' +
				'<script type="text/ng-template" id="nav-link.html">' +
				'<a ui-sref="main.{{item.name}}" ng-include="\'nav-content.html\'"></a>' +
				'</script>' +
				'<script type="text/ng-template" id="nav-content.html">' +
				'<span class="fa-fw" ng-class="item.iconClassName" ng-if="item.iconClassName"></span>' +
				'<span ng-if="item.iconClassName"> </span>' +
				'<span translate="{{item.name}}.title"></span>' +
				'</script>' +
			'</header>' +
			'<main class="container-fluid">' +
				'<h2 class="h1" translate="{{$root.pageTitleTranslationId}}"></h2>' +
				'<div ui-view></div>' +
			'</main>',
		modal: '<md-dialog flex="50">' +
				'<md-toolbar>' +
					'<div class="md-toolbar-tools">' +
						'<h2 translate="manageUser.title"></h2>' +
						'<span flex></span>' +
						'<md-button class="md-icon-button" ng-click="closeDialog()"><span class="fas fa-times"></span></md-button>' +
					'</div>' +
				'</md-toolbar>' +
				'<md-dialog-content>' +
					'<md-tabs md-selected="modalTabIndex" md-dynamic-height md-border-bottom>' +
						'<md-tab label="updateData">' +
							'<md-tab-label><span translate="manageUser.updateData"></span></md-tab-label>' +
							'<md-tab-body>' +
								'<div class="tab-body">' +
									'<form ng-submit="saveData()">' +
										'<p class="alert alert-danger" translate="manageUser.noUserData" ng-show="isNoUserData()"></p>' +
										'<div class="form-group">' +
											'<label translate="manageUser.nif"></label>' +
											'<input type="text" class="form-control" ng-model="data.nif" required>' +
										'</div>' +
										'<div class="form-group">' +
											'<label translate="manageUser.email"></label>' +
											'<input type="email" class="form-control" ng-model="data.email" required>' +
										'</div>' +
										'<button type="submit" class="btn btn-primary" translate="save"></button>' +
									'</form>' +
								'</div>' +
							'</md-tab-body>' +
						'</md-tab>' +
						'<md-tab label="updatePassword">' +
							'<md-tab-label><span translate="manageUser.updatePassword"></span></md-tab-label>' +
							'<md-tab-body>' +
								'<div class="tab-body">' +
									'<form ng-submit="saveNewPassword()">' +
										'<div class="form-group" ng-class="{\'has-error\': failOldPassword&&submittedResetPassword}">' +
											'<label translate="manageUser.password.current"></label>' +
											'<input type="password" ng-model="resetPasswordForm.current_password" class="form-control" required>' +
										'</div>' +
										'<div class="form-group">' +
											'<label translate="manageUser.password.new"></label>' +
											'<input type="password" ng-model="resetPasswordForm.new_password" class="form-control" required>' +
										'</div>' +
										'<div class="form-group" ng-class="{\'has-error\': failSameNewPassword&&submittedResetPassword}">' +
											'<label translate="manageUser.password.repeatNew"></label>' +
											'<input type="password" ng-model="resetPasswordForm.repeat_new_password" class="form-control" required>' +
										'</div>' +
										'<p class="alert alert-danger" translate="manageUser.password.fail_new_password" ng-if="failSameNewPassword"></p>' +
										'<p class="alert alert-danger" translate="manageUser.password.fail_old_password" ng-if="failOldPassword"></p>' +
										'<button type="submit" class="btn btn-primary">' +
											'<span class="fas fa-sync-alt"></span>' +
											'<span translate="manageUser.password.update"></span>' +
										'</button>' +
									'</form>' +
								'</div>' +
							'</md-tab-body>' +
						'</md-tab>' +
						'<md-tab label="updatePicture">' +
							'<md-tab-label><span translate="manageUser.updatePicture"></span></md-tab-label>' +
							'<md-tab-body>' +
								'<div class="tab-body text-center">' +
									'<img id="profileImage" ng-src="data:image/jpeg;base64,{{photoContent}}" class="img-responsive img-circle center-block" alt="Profile picture" onerror="this.onerror = null;this.src=\'img/default-avatar.jpg\'" width="150">' +
									'<input type="file" id="input-new-image" accept="image/*;capture=camera" onchange="angular.element(this).scope().processNewImage(this)" image="" resize-max-height="1000" resize-max-width="1000" resize-quality="0.7" resize-type="image/jpg" accept=".jpg,.jpeg,.png" class="hidden">' +
									'<button type="button" class="btn btn-primary" ng-click="getNewImage()"><span class="fas fa-camera fa-2x"></span></button>' +
								'</div>' +
							'</md-tab-body>' +
						'</md-tab>' +
					'</md-tabs>' +
				'</md-dialog-content>' +
			'</md-dialog>',
		home: '<h1 class="h3" translate="largeTitle"></h1>'
	} );
} )();
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

angular
	.module( 'proaTools.intranet' )
	.directive( 'ptSpinner', ptSpinner );

function ptSpinner( $http ) {
	return {
		restrict: 'E',
		template: '<div class="modal-backdrop fade in" id="modal-backdrop-spinner" ng-show="isLoading()">' +
				'<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
			'</div>',
		replace: true,
		scope: true,
		link: link
	};

	function link( scope ) {
		scope.isLoading = isLoading;

		function isLoading() {
			return $http.pendingRequests.length;
		}
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
	.provider( 'ptScreens', ptScreensProvider );

function ptScreensProvider( $stateProvider, PT_TEMPLATES, $urlRouterProvider ) {
	var list = [];
	this.$get = $get;
	this.setAll = setAll;

	function $get() {
		return list;
	}

	function setAll( list2 ) {
		var HOME_URL = 'home';
		$stateProvider
			.state( 'login', {
				url: '/login',
				template: PT_TEMPLATES.login,
				controller: 'PtLoginController'
			} )
			.state( 'main', {
				url: '/',
				template: PT_TEMPLATES.main,
				controller: 'PtMainController',
			} )
			.state( 'main.home', {
				url: HOME_URL,
				template: PT_TEMPLATES.home
			} );
		$urlRouterProvider.otherwise( '/' + HOME_URL );

		var submenus = {};
		angular.forEach( list2, function( obj ) {
			var parent = obj.parent,
				obj2 = {
					name: obj.name,
					permission: obj.permission,
					iconClassName: obj.iconClassName
				};
			if ( parent ) {
				var submenu = submenus[ parent ];
				if ( !submenu )
					submenu = submenus[ parent ] = [];
				submenu.push( obj2 );
			} else
				list.push( obj2 );

			if ( obj.noTemplate )
				return;
			var name = obj.name,
				kcName = _.kebabCase( name ),
				stateConfig = {
					url: kcName,
					templateUrl: 'app/' + kcName + '/view.html',
					resolve: obj.resolve
				},
				stateName = 'main.' + name,
				param = obj.param;
			if ( !obj.noController )
				stateConfig.controller = _.upperFirst( name ) + 'Controller';
			$stateProvider.state( stateName, stateConfig );
			if ( param ) {
				var stateConfig2 = angular.copy( stateConfig );
				stateConfig2.url = '/:' + param;
				$stateProvider.state( stateName + '.' + param, stateConfig2 );
			}
		} );

		angular.forEach( submenus, function( submenu, name ) {
			angular.forEach( list, function( obj ) {
				if ( obj.name == name )
					obj.submenu = submenu;
			} );
		} );
	}
}
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.run( runBlock );

function runBlock( $translate, getLang, $locale, $extraLocale, $mdDateLocale, $http, $rootScope, ptSessionService, dateFilter ) {
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

	$http.get( 'about.json' ).then( function( response ) {
		var data = response.data;
		console.info( 'Package: "' + data.name + '" v' + data.version + '.' );
	} );

	$rootScope.$on( '$stateChangeSuccess', function( event, toState ) {
		var translationId = toState.name.split( '.' )[ 1 ];
		$rootScope.pageTitleTranslationId = getTranslationId( translationId );
		$rootScope.pageLargeTitleTranslationId = getTranslationId( translationId, 'largeTitle' );
	} );

	$rootScope.userData = ptSessionService.getUserData();

	Date.prototype.toJSON = function() {
		var date = dateFilter( this, 'yyyy-M-d H:m:s' );
		if ( angular.isDate( date ) ) // Invalid date
			return null;
		return date;
	};

	function getTranslationId( str, str2 ) {
		return ( str ? str + '.' : '' ) + ( str2 || 'title' );
	}
}
} )();
( function() {
angular
	.module( 'proaTools.intranet' )
	.factory( 'getLang', getLang )
	.factory( 'getStringDate', getStringDate )
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

function getStringDate() {
	return function( date ) {
		if ( date instanceof Date )
			return date.getFullYear() + '-' + ( date.getMonth() + 1 ) + '-' + date.getDate();
		return '';
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
		resetPassword: resetPassword,
		updateUserPicture: updateUserPicture
	};

	function doLogin( username, pw ) {
		return dsApi.request( 'ValidarUsuario', [ username, pw, '', false, 'web' ] ).then( function( data ) {
			return data[ 0 ];
		} );
	}

	function checkPermissions( resources ) {
		return dsApi.request( 'ObtenerPermisos', [ $rootScope.userData.id_usuario, resources ] );
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