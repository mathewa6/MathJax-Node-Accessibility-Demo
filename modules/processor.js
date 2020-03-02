const TIMER     = require( './timer' );
const MJPAGE    = require( 'mathjax-node-page' ).mjpage;
const SRE       = require( 'speech-rule-engine' );
      SRE.setupEngine( { locale: 'en' } );

module.exports = {
    processRequest: async( req, res ) => {
        try {
            var promises = [];

            for ( var key in req.body.html ) {
                req.body.html[ key ] = req.body.html[ key ].replace( "\\(", "$" ).replace( "\\)", "$" ).replace( "\\[", "$" ).replace( "\\]", "$" );
                promises.push( module.exports.mjpageconversion( req.body.html[ key ], req.body.language ) );
            }

            Promise.all( promises ).then( ( output ) => {
                res.status( 201 ).send( {
                    success: 1,
                    timeMS: TIMER.end( req.body.starttime ),
                    content: output
                } );
                return;
            } ).catch( ( error ) => {
                res.status( 500 ).send( {
                    success: 0,
                    timeMS: TIMER.end( req.body.starttime ),
                    content: 'an error occured in mjpageconversion()'
                } );
                return;
            } ) ;

        } catch ( error ) {
            res.status( 500 ).send( {
                success: 0,
                timeMS: TIMER.end( req.body.starttime ),
                content: 'an error occured in processRequest()'
            } );
            return;
        }
    },
    mjpageconversion: async( html, language ) => {

        return new Promise( ( resolve, reject ) => {
            MJPAGE( html, {
                format: [ "TeX" ],
                fragment: true,
                cssInline: false,
                linebreaks: true,
                singleDollars: true,
                speakText: false,
                extensions: 'TeX/mhchem.js'
            }, {
                mml: true,
                svg: true
            }, ( output ) => {
                resolve( output );
            } ).on( 'afterConversion', function( parsedFormula ) {

                // Todo. Implement different language support
                parsedFormula.node.innerHTML = '<span style="font-size: 0px;"> ' +
                SRE.toSpeech( parsedFormula.outputFormula.mml ) +
                    '</span>' + parsedFormula.outputFormula.svg;

                var title = parsedFormula.node.getElementsByTagName( "title" )[ 0 ];
                if ( title ) {
                    title.parentNode.removeChild( title );
                }

                var label = parsedFormula.node.getElementsByTagName( "svg" )[ 0 ];
                if ( label ) {
                    label.removeAttribute( 'aria-labelledby' );
                    label.setAttribute( 'aria-label', 'Latex Formula' );
                }
            } );
        } );
    }
}