const models = require('../models/index');
const config = require('../config/config');
const {
    validationResult
} = require('express-validator')



module.exports = {
    get: {
        all: async (req, res, next) => {
            let userId = req.userId

            let user = await models.User.findOne({
                _id: userId
            }).populate('expenses').lean()

            let expenseExist = false;
            if (user.expenses.length > 0) {
                expenseExist = true
                // user.expenses.map((x) => {
                //     x.date = x.date.toString().slice(0, 15)
                // })
            }

            res.render('expenses.hbs', {
                title: 'All Expenses',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                expenseExist,
                expenses: user.expenses,
                userId
            })
        },
        create: (req, res, next) => {
            res.render('new-expense.hbs', {
                title: 'Add New Expense Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                userId: req.userId
            });
        },

        details: async (req, res, next) => {
            let id = req.params.id

            try {
                let expense = await models.Expenses.findOne({
                    _id: id
                }).lean()

                res.render('report.hbs', {
                    title: "Report About Expense",
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    ...expense,
                    userId: req.userId

                })
            } catch {
                if (error) {
                    console.error()
                    next(error)
                }

            }
        },
        delete: async (req, res, next) => {
            let id = req.params.id
            try {
                await models.Expenses.findOneAndDelete({
                    _id: id
                }, {
                    useFindAndModify: false
                })
                res.redirect('/expenses/all')
            } catch {
                if (error) {
                    console.log(error)
                    next(error)
                }
            }
        }

    },
    post: {
        create: async (req, res, next) => {
            let {
                merchant,
                total,
                vault,
                category,
                description,
                report
            } = req.body

            if (report === 'on') {
                report = true
            } else {
                report = false
            }

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.render('new-expense.hbs', {
                    message: errors.array()[0].msg,
                    oldInput: req.body,
                    title: 'Add New Expense Page',
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    userId: req.userId
                })
            }

            let user = req.userId
            let date = new Date().toDateString()

            console.log(date)
            let expense = {
                merchant,
                total,
                category,
                description,
                report,
                user,
                date
            }

            try {
                let newExpense = await models.Expenses.create(expense)
                await models.User.findByIdAndUpdate(user, {
                    $addToSet: {
                        expenses: [newExpense._id]
                    }
                })
                res.redirect('/expenses/all');
            } catch {
                next(error)
            }
        },
    }
}