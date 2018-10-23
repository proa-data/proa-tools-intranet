( function() {
angular
	.module( 'proaTools.intranet' )
	.value( '$extraLocale', {
		DATETIME_FORMATS: {
			fullShort: 'MM/dd/yyyy HH:mm:ss',
			fullShortDate: 'MM/dd/yyyy',
			fullShortTime: 'HH:mm:ss'
		},
		RANGE_SEP: '-',
		ANSWERS: [
			'Yes',
			'No'
		]
	} );
} )();