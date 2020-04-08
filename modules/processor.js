const TIMER     = require( './timer' );
const MJPAGE    = require( 'mathjax-node-page' ).mjpage;
const SRE       = require( 'speech-rule-engine' );
      SRE.setupEngine( { locale: 'en', domain: 'mathspeak' } );

module.exports = {

    extract: ( html ) => {
        return html
        .replace( "\\(", "$" )
                    .replace( "\\)", "$" )
                    .replace( "\\[", "$$$$" )
                    .replace( "\\]", "$$$$" );
    },

    processRequest: async( req, res ) => {
        try {
            var promises = [];

            for ( var key in req.body.html ) {
                req.body.html[ key ] = module.exports.extract( req.body.html[ key ] )

                promises.push( module.exports.mjpageconversion( req.body.html[ key ], req.body.language ) );
            }

            Promise.all( promises ).then( ( output ) => {
                res.status( 201 ).send( {
                    success: 1,
                    timeMS: TIMER.end( req.body.starttime ),
                    html: output
                } );
                return;
            } ).catch( ( error ) => {
                res.status( 500 ).send( {
                    success: 0,
                    timeMS: TIMER.end( req.body.starttime ),
                    errorMsg: 'an error occured in mjpageconversion()'
                } );
                return;
            } ) ;

        } catch ( error ) {
            console.log( error );
            res.status( 500 ).send( {
                success: 0,
                timeMS: TIMER.end( req.body.starttime ),
                errorMsg: 'an error occured in processRequest()'
            } );
            return;
        }
    },

    mjpageconversion: async( html, language ) => {
        const includesvg = false
        const includetext = false
        return new Promise( ( resolve, reject ) => {
            MJPAGE( html, {
                format: [ "TeX" ],
                fragment: true,
                cssInline: false,
                linebreaks: true,
                singleDollars: true,
                speakText: false,
                extensions: 'TeX/mhchem.js, TeX/AMSmath.js, TeX/AMSsymbols.js'
            }, {
                mml: true,
                svg: includesvg
            }, ( output ) => {
                resolve( output );
            } ).on( 'afterConversion', function( parsedFormula ) {

                if (language == 'en') {
                    SRE.setupEngine( { locale: 'en', domain: 'mathspeak' } );
                } else {
                    SRE.setupEngine( { locale: 'de', domain: 'mathspeak' } );
                }

                // Hide the mathml if svg and text is included
                output = '<span class="mathMLFormula" aria-hidden="${includesvg && includetext}">' +
                        parsedFormula.outputFormula.mml +
                        '</span>'
                output = (includetext ? output + '<p style="display:none;" aria-hidden="false" class="sr-only pLatexText"> ' +
                        SRE.toSpeech( parsedFormula.outputFormula.mml ) +
                        '</p>' : output);

                parsedFormula.node.innerHTML = (includesvg ? output + parsedFormula.outputFormula.svg : output);

                var title = parsedFormula.node.getElementsByTagName( "title" )[ 0 ];
                if ( title ) {
                    title.parentNode.removeChild( title );
                }

                var svg = parsedFormula.node.getElementsByTagName( "svg" )[ 0 ];
                if ( svg ) {
                    svg.removeAttribute( 'aria-labelledby' );
                    svg.setAttribute( 'aria-label', 'Latex Formula' );
                    svg.setAttribute( 'aria-hidden', 'true' );
                    svg.style.maxWidth = "100%";
                }
            } );
        } );
    }
}