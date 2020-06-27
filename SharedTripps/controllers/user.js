const models = require('../models/index');
const {
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
            let token = req.cookies['aid']
            if (token) {
                res.redirect('/tripp/all')
                return
            }
            res.render('register.hbs', {
                title: 'Register User Page',
            });
        },
        login: (req, res, next) => {
            let token = req.cookies['aid']
            if (token) {
                res.redirect('/tripp/all')
                return
            }
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
                email,
                password,
                rePassword
            } = req.body;

            let user = await models.User.findOne({
                email
            })
            if (user) {
                return res.render('register.hbs', {
                    message: "Email is already registered",
                    oldInput: req.body,
                    title: 'Register User Page',
                })
            }

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.render('register.hbs', {
                    message: errors.array()[0].msg,
                    oldInput: req.body,
                    title: 'Register User Page',
                })
            }



            let newUser = await models.User.create({
                email,
                password,
            });

            let token = jwt.createToken({
                id: newUser._id,
                username: newUser.email,
            });
            res.cookie('aid', token);
            res.redirect('/home');
        },

        login: async (req, res, next) => {
            let {
                email,
                password
            } = req.body;

            let user = await models.User.findOne({
                email
            });
            let status = await bcrypt.compare(password, user.password);
            if (status) {
                let token = await jwt.createToken({
                    id: user._id,
                    username: user.email
                })
                req.username = email
                res.cookie('aid', token)
                res.redirect('/home')
            } else {
                const message = 'Wrong password or email!'
                res.render('login.hbs', {
                    oldInput: req.body,
                    message,
                    title: 'Login User Page'
                });
                return;
            }
        },
    },

};