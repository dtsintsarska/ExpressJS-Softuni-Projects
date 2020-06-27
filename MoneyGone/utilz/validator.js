const {
    body
} = require('express-validator');


const expenseValidator = [
    body('merchant', "The merchant should be at least 4 characters long").isLength({
        min: 4
    }),
    body(
        'description',
        'Description should be min 10 symbols and max 50 symbols long!'
    ).isLength({
        min: 10,
        max: 50
    }),
    body('total').custom((value) => {
        if (value <= 0) {
            throw new Error('Total amount should be more than 0')
        }
        return true
    }),
];

const userValidator = [
    body('username', "Username should consist only english letters and digits").isAlphanumeric(),

    body('username', "Username should be at least 4 symbols long").isLength({
        min: 4
    }),

    body('password', "Password should be at least 8 symbols!").isLength({
        min: 8,
    }),

    body('amount').custom((value) => {
        if (value < 0) {
            throw new Error('Initial amount should be positive number')
        }
        return true
    }),
    body('rePassword').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Repeat password and password should match!');
        }
        return true;
    }),
];

module.exports = {
    expenseValidator,
    userValidator,
};