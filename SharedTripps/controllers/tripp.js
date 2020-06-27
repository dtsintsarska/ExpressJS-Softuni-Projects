const models = require('../models/index');
const config = require('../config/config');
const {
    validationResult
} = require('express-validator')



module.exports = {
    get: {
        all: async (req, res, next) => {
            let tripps = await models.Tripp.find().lean()
            res.render('sharedTripps.hbs', {
                title: 'All Shared Tripps',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                tripps
            })
        },
        create: (req, res, next) => {
            res.render('offerTripp.hbs', {
                title: 'Offer Tripp Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username
            });
        },

        details: async (req, res, next) => {
            let id = req.params.id

            try {
                let userId = req.userId.toString()
                let trip = await models.Tripp.findOne({
                    _id: id
                }).populate('buddies').populate('driver').lean()
                let isEnrolled = trip.buddies.map((x) => x._id = x._id.toString()).includes(userId)

                let buddiesNames = trip.buddies.map((x) => x = x.email).join(', ')

                let freeSeats = Number(trip.seats) - trip.buddies.length
                let hasFreeSeats = false;
                if (freeSeats > 0) {
                    hasFreeSeats = true
                }

                res.render('availableTrippDetails.hbs', {
                    title: "Details About Tripp",
                    isLoggedIn: req.isLoggedIn,
                    username: req.username,
                    ...trip,
                    buddiesNames,
                    isDriver: req.userId.toString() === trip.driver._id.toString(),
                    isEnrolled,
                    driver: trip.driver.email,
                    freeSeats,
                    hasFreeSeats
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
                await models.Tripp.findOneAndDelete({
                    _id: id
                }, {
                    useFindAndModify: false
                })
                res.redirect('/tripp/all')
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
                startAndEndPoint,
                dataTime,
                carImage,
                seats,
                description
            } = req.body

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.render('offerTripp.hbs', {
                    message: errors.array()[0].msg,
                    oldInput: req.body,
                    title: 'Offer Tripp Page',
                    isLoggedIn: req.isLoggedIn,
                    username: req.username
                })
            }

            let [startPoint, endPoint] = startAndEndPoint.split(' - ')
            let [date, time] = dataTime.split(' - ')
            let driver = req.userId

            let trip = {
                startPoint,
                endPoint,
                date,
                time,
                carImage,
                driver,
                seats,
                description

            }
            try {
                await models.Tripp.create(trip)
                res.redirect('/tripp/all');
            } catch {
                next(err)
            }

        },


        enroll: async (req, res, next) => {
            let tripId = req.params.id;
            let userId = req.userId

            try {
                await models.Tripp.findByIdAndUpdate(tripId, {
                    $addToSet: {
                        buddies: [userId]
                    }
                })
                await models.User.findByIdAndUpdate(userId, {
                    $addToSet: {
                        tripps: [tripId]
                    }
                })

                res.redirect(`/tripp/details/${tripId}`)
            } catch {
                if (error) {
                    console.log(error)
                    next(error)
                }
            }
        }
    }
}