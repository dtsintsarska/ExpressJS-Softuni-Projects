const {
    Course
} = require('../models/index');

module.exports = {

    get: {
        home: async (req, res, next) => {

            res.render('home.hbs', {
                title: 'Home Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username
            })
        }
    }
}