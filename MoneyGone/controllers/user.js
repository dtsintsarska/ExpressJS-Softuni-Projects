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
                res.redirect('/expenses/all')
                return
            }
            res.render('register.hbs', {
                title: 'Register User Page',
            });
        },
        login: (req, res, next) => {
            let token = req.cookies['aid']
            if (token) {
                res.redirect('/expenses/all')
                return
            }
            res.render('login.hbs', {
                title: 'Login User Page',
            });
        },
        logout: (req, res, next) => {

            res.clearCookie('aid')
            res.redirect('/home')
        },

        profil: async (req, res, next) => {
            let id = req.params.id

            let user = await models.User.findById(id).populate('expenses').lean()
            let allEx = 0;
            user.expenses.forEach(element => {
                allEx += Number(element.total)
            })

            let diff = Number(user.amount) - allEx

            res.render('account-info.hbs', {
                title: 'User Info Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                userId: id,
                ...user,
                allEx,
                diff
            })
        }
    },

    post: {
        register: async (req, res, next) => {
            let {
                username,
                password,
                rePassword,
                amount
            } = req.body;

            let user = await models.User.findOne({
                username
            })
            if (user) {
                return res.render('register.hbs', {
                    message: "Username is already taken",
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
                amount
            });

            let token = jwt.createToken({
                id: newUser._id,
                username: newUser.username,
            });
            res.cookie('aid', token);
            res.redirect('/expenses/all');
        },

        login: async (req, res, next) => {
            let {
                username,
                password
            } = req.body;

            let user = await models.User.findOne({
                username
            });
            if (!user) {
                const message = 'Wrong password or username!'
                res.render('login.hbs', {
                    oldInput: req.body,
                    message,
                    title: 'Login User Page'
                });
                return;
            }
            let status = await bcrypt.compare(password, user.password);

            if (status) {
                let token = await jwt.createToken({
                    id: user._id,
                    username: user.username
                })
                req.username = username
                res.cookie('aid', token)
                res.redirect('/expenses/all')
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
        refill: async (req, res, next) => {
            let {
                refill
            } = req.body

            let userId = req.params.id

            try {
                let user = await models.User.findById(userId)
                let total = Number(user.amount) + Number(refill)
                await models.User.findByIdAndUpdate(userId, {
                    amount: total
                })
                res.redirect('/expenses/all')

            } catch {
                console.log(error)
            }

        }
    },

};