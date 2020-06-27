const {
    body
} = require('express-validator');
const {
    User
} = require('../models/index')

const tripValidator = [
    body('startAndEndPoint').custom((value) => {
        if (!value.match(/^[\w.: ]{4,} - [\w.: ]{4,}$/)) {
            throw new Error('Starting and End point should be at least 4 characters long (each) and should be separated with single space, dash and another single space (" - ")');
        }
        return true;
    }),

    body('dataTime').custom((value) => {
        if (!value.match(/^[\w.: ]{6,} - [\w.: ]{6,}$/)) {
            throw new Error('Date and Time should be at least 6 characters long (each) and should be separated with single space, dash and another single space (" - ")');
        }
        return true;
    }),
    body(
        'description',
        'Trip description should be at least 10 symbols long!'
    ).isLength({
        min: 10,
    }),
    body('carImage').custom((value) => {
        if (!value.match(/^http[s]?:\/\/.+/)) {
            throw new Error('CarImage should starts with http:// or https://!');
        }
        return true;
    }),
    body('seats').custom((value) => {
        if (value <= 0) {
            throw new Error('Number of seats should be more than 0')
        }
        return true
    }),
];

const userValidator = [
    body('email', "Email should be with valid").isEmail(),

    body('password', "Password should be at least 6 symbols!").isLength({
        min: 6,
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
    tripValidator,
    userValidator,
};