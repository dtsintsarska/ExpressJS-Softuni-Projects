const models = require('../models/index');
const config = require('../config/config');
const {
    validationResult
} = require('express-validator')



module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('create-course.hbs', {
                title: 'Create Course Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username
            });
        },

        details: async (req, res, next) => {
            let id = req.params.id

            try {
                let userId = req.userId.toString()
                let course = await models.Course.findById(id).lean()
                let isEnrolled = course.users.map((x) => x = x.toString()).includes(userId)

                res.render('course-details.hbs', {
                    title: "Details About Course",
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    ...course,
                    isAuthor: req.userId.toString() === course.author.toString(),
                    isEnrolled
                })
            } catch {
                if (error) {
                    console.error()
                    next(error)
                }

            }
        },
        edit: async (req, res, next) => {

            let id = req.params.id
            try {
                let course = await models.Course.findById(id).lean()
                res.render('edit-course.hbs', {
                    title: "Edit Course",
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    ...course,
                })
            } catch {
                if (error) {
                    next(error)
                }
            }
        },

        delete: async (req, res, next) => {
            let id = req.params.id
            try {
                await models.Course.findOneAndDelete({
                    _id: id
                }, {
                    useFindAndModify: false
                })
                res.redirect('/home')
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
                title,
                description,
                imageUrl,
                isPublic
            } = req.body

            if (isPublic === 'on') {
                isPublic = true
            } else {
                isPublic = false
            }

            let author = req.userId
            let createdAt = new Date

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.render('create-course.hbs', {
                    message: errors.array()[0].msg,
                    oldInput: req.body,
                    title: 'Create Course Page',
                    isLoggedIn: req.isLoggedIn,
                    username: req.username
                })
            }

            let course = {
                title,
                description,
                imageUrl,
                isPublic,
                author,
                createdAt
            };
            try {
                await models.Course.create(course)
                res.redirect('/home');
            } catch {
                next(err)
            }

        },

        edit: async (req, res, next) => {

            let id = req.params.id
            let {
                title,
                description,
                imageUrl,
                isPublic
            } = req.body
            if (isPublic === 'on') {
                isPublic = true
            } else {
                isPublic = false
            }

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let course = await models.Course.findById(id).lean()
                return res.render('edit-course.hbs', {
                    message: errors.array()[0].msg,
                    title: 'Edit Course Page',
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    ...course
                })
            }

            try {
                await models.Course.findByIdAndUpdate(id, {
                    title,
                    description,
                    imageUrl,
                    isPublic
                }, {
                    useFindAndModify: false
                })
                res.redirect(`/course/details/${id}`);
            } catch {
                if (error) {
                    console.log(error)
                    next(error)
                }
            }
        },
        enroll: async (req, res, next) => {
            let courseId = req.params.id;
            let userId = req.userId

            try {
                await models.Course.findByIdAndUpdate(courseId, {
                    $addToSet: {
                        users: [userId]
                    }
                })
                await models.User.findByIdAndUpdate(userId, {
                    $addToSet: {
                        courses: [courseId]
                    }
                })
                res.redirect(`/course/details/${courseId}`)
            } catch {
                if (error) {
                    console.log(error)
                    next(error)
                }
            }
        }
    }
}