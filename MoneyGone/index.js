require('dotenv').config()

const env = process.env.NODE_ENV || 'development'
const express = require('express')
const app = express()

const config = require('./config/config')[env];

const mongoose = require('mongoose')

mongoose.connect(config.DB_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.error(err)
        throw new Error('Not connected to DB')
    }

    console.log('Successfully connect to DB!')
})

require('./config/express')(app)
require('./config/routes')(app)


app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));