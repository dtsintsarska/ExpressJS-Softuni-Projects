const models = require('../models/index');
const {
    raw
} = require('express');

module.exports = {

    get: {
        home: async (req, res, next) => {
            if (req.isLoggedIn) {
                return res.redirect('/play/all')
            }

            let plays = await models.Play.find({
                isPublic: true
            }).lean()
            plays = plays.sort((a, b) => b.likes.length - a.likes.length)
            plays = plays.slice(0, 3)
            res.render('home.hbs', {
                title: 'Guest Home Page',
                isLoggedIn: req.isLoggedIn,
                username: req.username,
                plays
            })
        }
    }
}