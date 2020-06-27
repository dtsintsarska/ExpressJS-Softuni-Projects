const {
    Course
} = require('../models/index');

module.exports = {

    get: {
        home: async (req, res, next) => {

            let token = req.cookies['aid'];
            if (token) {
                return res.redirect('/expenses/all')
            }
            res.render('home.hbs', {
                title: 'Home Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username
            })
        }
    }
}