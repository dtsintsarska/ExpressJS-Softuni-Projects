const {
    body
} = require('express-validator');


const playValidator = [
    body('title').custom((value) => {
        if (value == '') {
            throw new Error('Title, description and imageUrl should be filled')
        }
        return true
    }),

    body('description').custom((value) => {
        if (value == '') {
            throw new Error('Title, description and imageUrl should be filled')
        }
        return true
    }),

    body('imageUrl').custom((value) => {
        if (value == '') {
            throw new Error('Title, description and imageUrl should be filled')
        };
        return true;
    })
];

const userValidator = [
    body('username', "Username should consist only english letters and digits").isAlphanumeric(),

    body('username', "Username should be at least 3 symbols!").isLength({
        min: 3,
    }),
    body('password', "Password should be at least 3 symbols!").isLength({
        min: 3,
    }),
    body('password', "Password should consist only english letters and digits").isAlphanumeric(),

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
    playValidator,
    userValidator,
};