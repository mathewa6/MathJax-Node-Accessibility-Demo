const PROCESSOR		= require( './modules/processor' );

module.exports = {

	convert: async( html, language ) => {

		try {

			html = PROCESSOR.extract( html );
			return PROCESSOR.mjpageconversion( html, language );

		} catch ( error ) {
			console.log( error, 'an error occured in processRequest()');
			return;
		}

	}

}