const models = require('../models/index');

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
                res.redirect('/play/all')
                return
            }
            res.render('register.hbs', {
                title: 'Register User Page',
            });
        },
        login: (req, res, next) => {
            let token = req.cookies['aid']
            if (token) {
                res.redirect('/play/all')
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
                username,
                password,
                rePassword
            } = req.body;

            let user = await models.User.findOne({
                username
            })
            if (user) {
                return res.render('register.hbs', {
                    message: "Username is already registered",
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
                username,
                password,
            });

            let token = jwt.createToken({
                id: newUser._id,
                username: newUser.username,
            });
            res.cookie('aid', token);
            res.redirect('/play/all');
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
                res.redirect('/play/all')
            } else {
                const message = 'Wrong password or username!'
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