( function() {
angular
	.module( 'proaTools.intranet' )
	.value( '$extraLocale', {
		DATETIME_FORMATS: {
			fullShort: 'dd/MM/yyyy HH:mm:ss',
			fullShortDate: 'dd/MM/yyyy',
			fullShortTime: 'HH:mm:ss'
		},
		RANGE_SEP: '-',
		ANSWERS: [
			'Sí',
			'No'
		]
	} );
} )();