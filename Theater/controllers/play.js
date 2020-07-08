const models = require('../models/index');
const config = require('../config/config');
const {
    validationResult
} = require('express-validator')



module.exports = {
    get: {
        all: async (req, res, next) => {
            let plays = await models.Play.find({
                isPublic: true
            }).sort({
                createdAt: -1
            }).lean()

            res.render('all-plays.hbs', {
                title: 'Home Page | All Plays',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                plays
            })
        },
        sortByDate: async (req, res, next) => {
            let plays = await models.Play.find({
                isPublic: true
            }).sort({
                createdAt: -1
            }).lean()

            res.render('all-plays.hbs', {
                title: 'Home Page | All Plays',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                plays
            })
        },
        sortByLikes: async (req, res, next) => {
            let plays = await models.Play.find({
                isPublic: true
            }).lean()
            plays = plays.sort((a, b) => b.likes.length - a.likes.length)

            res.render('all-plays.hbs', {
                title: 'Home Page | All Plays',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                plays
            })
        },
        create: (req, res, next) => {
            res.render('create-theater.hbs', {
                title: 'Create New Play Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username
            });
        },

        details: async (req, res, next) => {
            let id = req.params.id

            try {
                let userId = req.userId.toString()
                let play = await models.Play.findOne({
                    _id: id
                }).lean()
                let isAlreadyLiked = play.likes.map((x) => x._id = x._id.toString()).includes(userId)

                res.render('theater-details.hbs', {
                    title: "Details About Play",
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    ...play,
                    isCreator: req.userId.toString() === play.creator.toString(),
                    isAlreadyLiked,

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
                await models.Play.findOneAndDelete({
                    _id: id
                }, {
                    useFindAndModify: false
                })
                res.redirect('/play/all')
            } catch {
                if (error) {
                    console.log(error)
                    next(error)
                }
            }
        },
        edit: async (req, res, next) => {
            let id = req.params.id
            let play = await models.Play.findById(id).lean()

            res.render('edit-theater.hbs', {
                title: 'Edit Play Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                ...play
            });

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

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.render('create-theater.hbs', {
                    message: errors.array()[0].msg,
                    oldInput: req.body,
                    title: 'Create New Play Page',
                    isLoggedIn: req.isLoggedIn,
                    username: req.username
                })
            }

            let createdAt = (new Date() + "").slice(0, 24)
            let creator = req.userId

            if (isPublic === 'on') {
                isPublic = true
            } else {
                isPublic = false;
            }

            let play = {
                title,
                description,
                imageUrl,
                isPublic,
                createdAt,
                creator
            }
            try {
                await models.Play.create(play)
                res.redirect('/play/all');
            } catch {
                next(err)
            }

        },


        like: async (req, res, next) => {
            let playId = req.params.id;
            let userId = req.userId

            try {
                await models.Play.findByIdAndUpdate(playId, {
                    $addToSet: {
                        likes: [userId]
                    }
                })
                await models.User.findByIdAndUpdate(userId, {
                    $addToSet: {
                        likedPlays: [playId]
                    }
                })

                res.redirect(`/play/details/${playId}`)
            } catch {
                if (error) {
                    console.log(error)
                    next(error)
                }
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
                let play = await models.Play.findById(id).lean()
                return res.render('edit-theater.hbs', {
                    message: errors.array()[0].msg,
                    ...play,
                    title: 'Edit Play Page',
                    isLoggedIn: req.isLoggedIn,
                    username: req.username
                })
            }

            try {
                await models.Play.findByIdAndUpdate(id, {
                    title,
                    description,
                    imageUrl,
                    isPublic
                })
                res.redirect('/play/all')

            } catch {
                if (error) {
                    console.log(error)
                    next(error)
                }
            }

        }
    }
}