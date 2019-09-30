const BASICAUTH     = require('basic-auth');
const SHA3          = require('js-sha3').sha3_512;
const JSONWEBTOKEN  = require('jsonwebtoken');

module.exports = {

    getConfig: () => {
        return {
            apiKey: 'changeThisIntoASecretApiKey',
            salt: 'changeThisIntoASecretSalt'
        };
    },

    getUser: () => {
        return {
            'changeThisUsername': {password: SHA3('changeThisPassword' + module.exports.getConfig().salt)}
        };
    },

    hasBasicAuthHeader: (user) => {
        return typeof user !== 'undefined'
            && typeof user.name !== 'undefined'
            && typeof user.pass !== 'undefined';
    },

    isPasswordCorrect: (user) => {
        return module.exports.getUser()[user.name].password 
            == SHA3(user.pass + module.exports.getConfig().salt);
    },

    verifyLogin: async(req, res, next) => {
        try {
            var user = BASICAUTH(req);

            if (!module.exports.hasBasicAuthHeader(user)) {
                res.status(401).send({
                    success: 0,
                    content: 'missing (basic auth) header'
                });
                return;
            }

            if (!module.exports.getUser()[user.name]) {
                res.status(403).send({
                    success: 0,
                    content: 'the specified user does not exist'
                });
                return;
            }
            if (!module.exports.isPasswordCorrect(user)) {
                res.status(403).send({
                    success: 0,
                    content: 'the entered password is not correct'
                });
                return;
            }
            if (module.exports.getUser()[user.name]
                && module.exports.isPasswordCorrect(user)) {
                req.user = user.name;
                next();
                return;
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: 0,
                content: 'an error occured in VerifyLogin()'
            });
            return;
        }
    },

    verifyToken: async(req, res, next) => {
        try {
            const bearerHeader = req.headers['authorization'];

            if (typeof bearerHeader !== 'undefined') {

                const bearerToken = bearerHeader.split(' ')[1];

                JSONWEBTOKEN.verify(bearerToken, module.exports.getConfig().apiKey, (error, _authData) => {

                    if(error) {
                        res.status(403).send({
                            success: 0,
                            content: 'no valid token'
                        });
                        return;
                    } else {
                        next();
                    }
                });
            } else {
                res.status(401).send({
                    success: 0,
                    content: 'no token entered'
                });
                return;
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: 0,
                content: 'an error occured in verifyToken()'
            });
            return;
        }
    },

    sendToken: async(req, res) => {
        try {
            JSONWEBTOKEN.sign({user: req.user}, module.exports.getConfig().apiKey, (_error, token) => {

                res.status(201).send({
                    success: 1,
                    content: token
                });
                return;
            });
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: 0,
                content: 'an error occured in sendToken()'
            });
            return;
        }
    }
}