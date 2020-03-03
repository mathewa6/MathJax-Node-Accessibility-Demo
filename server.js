const EXPRESS       = require( 'express' );
const HELMET        = require( 'helmet' );
const APP           = EXPRESS();
const HTTP          = require( 'http' ).Server( APP );
const BODYPARSER    = require( 'body-parser' );

APP.use( HELMET() );
APP.use( BODYPARSER.json( { limit: "50mb" } ) );
APP.use( BODYPARSER.urlencoded( {
    limit: "50mb", 
    extended: true, 
    parameterLimit:50000} ) );

APP.use( ( error, _req, res, next ) => {
    if ( error instanceof SyntaxError ) {
        res.status( 400 ).send( {
            success: 0,
            content: 'Request includes invalid JSON syntax'
        } );
    } else {
        next();
    }
} );

const TIMER         = require( './modules/timer' );
const ACCESSOR      = require( './modules/accessor' );
const PROCESSOR     = require( './modules/processor' );
const VALIDATOR     = require( './modules/validator' );

HTTP.listen( process.env.PORT || 3000, function() {
    console.log( '====================================' );
    console.log( 'Service started.....................' );
    console.log( '====================================' );
} );

process.on( 'uncaughtException', function ( error ) {
    console.log( error )
} );

// =============================================================
// Routing.
// =============================================================

APP.get( '/', TIMER.start, ( req, res ) => {
    res.send( {
        success: 1,
        timeMS: TIMER.end( req.body.starttime ),
        routes: {
            '/access': {
                type: 'GET',
                auth: {
                    type: 'Basic Auth',
                    required: 'Username, Password'
                }
            },
            '/process': {
                type: 'POST',
                auth: {
                    type: 'Bearer Token',
                    required: 'Token'
                },
                body: {
                    type: 'Json'
                }
            }
        }
    } );
    return;
} ),

APP.get( '/access', TIMER.start, ACCESSOR.verifyLogin, ( req, res ) => {
    ACCESSOR.sendToken( req, res );
    return;
} );

APP.get( '*', TIMER.start, ( req, res ) => {
    res.status( 404 ).send( {
        success: 0,
        timeMS: TIMER.end( req.body.starttime ),
        errorMsg: 'no such route'
    } );
    return;
} );

APP.post( '/process', TIMER.start, ACCESSOR.verifyToken, VALIDATOR.validate, ( req, res ) => {
    PROCESSOR.processRequest( req, res );
    return;
} );

APP.post( '*', TIMER.start, ( req, res ) => {
    res.status( 404 ).send( {
        success: 0,
        timeMS: TIMER.end( req.body.starttime ),
        errorMsg: 'no such route'
    } );
    return;
} );
