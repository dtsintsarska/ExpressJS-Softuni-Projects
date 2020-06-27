const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser')


module.exports = (app) => {

    app.engine(
        '.hbs', handlebars({
            extname: '.hbs',
            layoutsDir: 'views',
            defaultLayout: 'layouts/main',
            partialsDir: 'views/partials'

        })
    );
    app.set('view engine', '.hbs');

    app.use(
        express.urlencoded({
            extended: true,
        })
    );
    app.use(express.json());
    app.use(cookieParser())

    app.use('/static', express.static('static'));
};