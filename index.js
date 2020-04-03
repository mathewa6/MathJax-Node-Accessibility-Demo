const PROCESSOR		= require( './modules/processor' );

module.exports = {

	convert: async( html, language ) => {

		try {

			html = html
			.replace( "\\(", "$" )
			.replace( "\\)", "$" )
			.replace( "\\[", "$$$$" )
			.replace( "\\]", "$$$$" );

			return PROCESSOR.mjpageconversion( html, language );

		} catch ( error ) {
			console.log( error, 'an error occured in processRequest()');
			return;
		}

	}

}