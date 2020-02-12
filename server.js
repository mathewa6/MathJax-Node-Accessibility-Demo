const EXPRESS       = require('express');
const HELMET        = require('helmet');
const APP           = EXPRESS();
const HTTP          = require('http').Server(APP);
const BODYPARSER    = require('body-parser');

APP.use(HELMET());
APP.use(BODYPARSER.json());
APP.use((error, _req, res, next) => {
    if (error instanceof SyntaxError) {
        res.status(400).send({
            success: 0,
            content: 'Request includes invalid JSON syntax'
        });
    } else {
      next();
    }
});


const ACCESSOR      = require('./modules/accessor');
const PROCESSOR     = require('./modules/processor');

HTTP.listen(process.env.PORT || 3000, function() {
    console.log('====================================');
    console.log('Service started.....................');
    console.log('====================================');
});

process.on('uncaughtException', function (error) {
    console.log(error)
});

// =============================================================
// Routing.
// =============================================================

APP.get('/', (_req, res) => {
    res.send({
        success: 1,
        content: {
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
        }
    });
    return;
}),

APP.get('/access', ACCESSOR.verifyLogin, (req, res) => {
    ACCESSOR.sendToken(req, res);
    return;
});

APP.get('*', (_req, res) => {
    res.status(404).send({
        success: 0,
        content: 'no such route'
    });
    return;
});

APP.post('/process/', ACCESSOR.verifyToken, (req, res) => {
    PROCESSOR.processRequest(req, res);
    return;
});

APP.post('*', (_req, res) => {
    res.status(404).send({
        success: 0,
        content: 'no such route'
    });
    return;
});