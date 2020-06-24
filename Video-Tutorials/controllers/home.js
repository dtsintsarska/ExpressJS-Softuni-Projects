const {
    Course
} = require('../models/index');

module.exports = {

    get: {
        home: async (req, res, next) => {

            let courses = await Course.find().lean()
            res.render('homePage.hbs', {
                title: 'Home Page',
                courses,
                isLoggedIn: req.isLoggedIn,
                username: req.username
            })
        }
    },

    post: {
        search: (req, res, next) => {

            const {
                search
            } = req.body

            Course.find().lean().then(courses => {
                const filteredcourses = courses.filter(course => course.title.toLowerCase().includes(search.toLowerCase()));
                res.render('homePage.hbs', {
                    pageTitle: 'Home Page',
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    courses: filteredcourses
                });
            }).catch(next)
        }
    }
}