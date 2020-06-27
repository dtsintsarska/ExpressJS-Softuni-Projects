const jwt = require('jsonwebtoken');
const config = require('../config/config')
const secret = config.development.privateKey;
const models = require('../models/index')

function createToken(data) {
    return jwt.sign(data, secret, {
        expiresIn: '1h'
    });
}


const auth = (redirect = false) => {
    return function (req, res, next) {
        let token = req.cookies['aid'] || '';

        try {
            jwt.verify(token, secret);
            let decoded = jwt.decode(token)
            req.username = decoded.username
            req.userId = decoded.id
            req.isLoggedIn = true
            next()
        } catch {
            req.isLoggedIn = false;
            if (redirect) {
                res.redirect('/user/login')
                return
            }
            next()
        }
    }
}

module.exports = {
    createToken,
    //verifyToken,
    auth
};
