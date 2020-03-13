const TIMER = require( './timer' );

module.exports = {

    getConfig: () => {
        return {
            apiKeys: [
                'secretapikey0',
                'secretapikey1',
            ]
        };
    },

    verifyApiKey: async( req, res, next ) => {
        try {
            console.log(req.headers)
            const apiKey = req.headers[ 'api-key' ];

            if ( typeof apiKey !== 'undefined' ) {

                if ( module.exports.getConfig().apiKeys.includes( apiKey ) ) {
                    next();
                } else {
                    res.status( 403 ).send( {
                        success: 0,
                        timeMS: TIMER.end( req.body.starttime ),
                        errorMsg: 'no valid API Key in message header'
                    } );
                    return;
                }
            } else {
                res.status( 401 ).send( {
                    success: 0,
                    timeMS: TIMER.end( req.body.starttime ),
                    errorMsg: 'no API Key entered in message header.'
                } );
                return;
            }
        } catch ( error ) {
            console.log( error )
            res.status( 500 ).send( {
                success: 0,
                timeMS: TIMER.end( req.body.starttime ),
                errorMsg: 'an error occured in verifyToken()'
            } );
            return;
        }
    }
}