( function() {
angular
	.module( 'proaTools.intranet' )
	.value( '$extraLocale', {
		DATETIME_FORMATS: {
			paddedMedium: 'dd/MM/yyyy HH:mm:ss',
			paddedMediumDate: 'dd/MM/yyyy',
			paddedMediumTime: 'HH:mm:ss',
			paddedShort: 'dd/MM/yyyy HH:mm',
			paddedShortDate: 'dd/MM/yyyy',
			paddedShortTime: 'HH:mm',
			filenameMedium: 'd-M-yyyy H.mm.ss',
			filenameMediumDate: 'd-M-yyyy',
			filenameMediumTime: 'H.mm.ss'
		},
		RANGE_SEP: '-',
		ANSWERS: [
			'No',
			'Sí'
		]
	} );
} )();