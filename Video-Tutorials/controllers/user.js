const models = require('../models/index');
const {
    verifyToken,
    createToken
} = require('../utilz/jwt');
const jwt = require('../utilz/jwt');
const bcrypt = require('bcrypt');
const {
    validationResult
} = require('express-validator')

module.exports = {
    get: {
        register: (req, res, next) => {
            res.render('register.hbs', {
                title: 'Register User Page',
            });
        },
        login: (req, res, next) => {
            res.render('login.hbs', {
                title: 'Login User Page',
            });
        },
        logout: (req, res, next) => {
            res.clearCookie('aid')
            res.redirect('/home')
        }
    },

    post: {
        register: async (req, res, next) => {
            let {
                username,
                password,
                repeatPassword
            } = req.body;

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.render('register.hbs', {
                    message: errors.array()[0].msg,
                    oldInput: req.body,
                    title: 'Register User Page',
                })
            }
            let newUser = await models.User.create({
                username,
                password,
            });

            let token = jwt.createToken({
                id: newUser._id,
                username: newUser.username,
            });
            res.cookie('aid', token);
            res.redirect('/home');
        },

        login: async (req, res, next) => {
            let {
                username,
                password
            } = req.body;

            let user = await models.User.findOne({
                username
            });
            let status = await bcrypt.compare(password, user.password);
            if (status) {
                let token = await jwt.createToken({
                    id: user._id,
                    username: user.username
                })
                req.username = username
                res.cookie('aid', token)
                res.redirect('/home')
            } else {
                const message = 'Wrong password or username!'
                res.render('login.hbs', {
                    username,
                    password,
                    message,
                    title: 'Login User Page'
                });
                return;
            }
        },
    },

};