( function() {
angular
	.module( 'app', [ 'proaTools.intranet' ] )
	.run( runBlock )
	.controller( 'LangController', LangController )
	.controller( 'FiltersController', FiltersController )
	.controller( 'DateController', DateController )
	.controller( 'SelectsController', SelectsController );

function runBlock( $rootScope ) {
	$rootScope.now = new Date;
}

function LangController( getLang ) {
	var vm = this;
	vm.lang = getLang();
}

function FiltersController( $rootScope ) {
	var vm = this;
	vm.now = $rootScope.now;
	var num = getFloat();
	vm.nums = [ num, getFloat( num ) ];
	vm.bool = chance.bool();

	function getFloat( min ) {
		min = min || 0;
		return chance.floating( {
			min: min,
			max: min + 1000
		} );
	}
}

function DateController( $rootScope ) {
	var vm = this;
	vm.date = $rootScope.now;
}

function SelectsController() {
	var vm = this;
	vm.params = {
		noMultiple: undefined,
		multiple: []
	};
	vm.list = [];
	vm.change = change;

	var lists = [
			[
				{ code: 1, name: 'One' },
				{ code: 2, name: 'Two (1)' },
				{ code: 3, name: 'Three (1)' }
			],
			[
				{ code: 2, name: 'Two (2)' },
				{ code: 3, name: 'Three (2)' },
				{ code: 4, name: 'Four' }
			]
		],
		i = 0;

	activate();

	function activate() {
		change();
	}

	function change() {
		i = i ? 0 : 1;
		vm.list = lists[ i ];
	}
}
} )();