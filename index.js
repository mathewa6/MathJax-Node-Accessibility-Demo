const PROCESSOR     = require( './modules/processor' );

module.exports = {

	convert: async( html ) => {

        try {
            var promises = [];

            for ( var key in req.body.html ) {
                req.body.html[ key ] = req.body.html[ key ]
                    .replace( "\\(", "$" )
                    .replace( "\\)", "$" )
                    .replace( "\\[", "$$$$" )
                    .replace( "\\]", "$$$$" );

                promises.push( PROCESSOR.mjpageconversion( req.body.html[ key ], req.body.language ) );
            }

            Promise
            .all( promises )
            .then( ( output ) => {
                // output
                return;
            } )
            .catch( ( error ) => {
                consle.log( error, 'an error occured in mjpageconversion()' );
                return;
            } ) ;

        } catch ( error ) {
            console.log( error, 'an error occured in processRequest()');
            return;
        }

    }

}