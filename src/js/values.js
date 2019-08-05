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