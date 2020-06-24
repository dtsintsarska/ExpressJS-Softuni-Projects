const {
    body
} = require('express-validator');

const courseValidator = [
    body('title', 'Course title should be at least 4 symbols!').isLength({
        min: 4,
    }),
    body(
        'description',
        'Course description should be at least 20 symbols and maximum 50 symbols!'
    ).isLength({
        min: 20,
        max: 50
    }),
    body('imageUrl').custom((value) => {
        if (!value.match(/^http[s]?:\/\/.+/)) {
            throw new Error('ImageUrl should starts with http:// or https://!');
        }
        return true;
    }),
];

const userValidator = [
    body('username', "Username should be at least 5 symbols!").isLength({
        min: 5,
    }),
    body('username', "Username should consist alphanumeric!").isAlphanumeric(),
    body('password', "Password should be at least 5 symbols!").isLength({
        min: 5,
    }),
    body(
        'password',
        "Password should consist alphanumeric!"
    ).isAlphanumeric(),
    body('repeatPassword').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Repeat password and password should match!');
        }
        return true;
    }),
];

module.exports = {
    courseValidator,
    userValidator,
};