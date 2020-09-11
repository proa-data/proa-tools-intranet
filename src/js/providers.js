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
			var parent = obj.parent;

			var obj2 = {
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
			if ( parent )
				stateConfig.data = { parentMenu: parent };
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