( function() {
angular
	.module( 'app', [ 'proaTools.intranet' ] )
	.controller( 'LangController', LangController )
	.controller( 'FiltersController', FiltersController );

function LangController( getLang ) {
	var vm = this;
	vm.lang = getLang();
}

function FiltersController() {
	var vm = this;
	vm.now = new Date;
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
} )();