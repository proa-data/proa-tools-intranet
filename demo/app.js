( function() {
angular
	.module( 'app', [ 'proaTools.intranet' ] )
	.run( runBlock )
	.controller( 'LangController', LangController )
	.controller( 'FiltersController', FiltersController )
	.controller( 'DateController', DateController );

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
} )();