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
			listProp = elem.attr( 'ng-repeat' ).split( 'in' )[ 1 ],
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