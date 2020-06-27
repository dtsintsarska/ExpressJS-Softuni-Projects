const routers = require('../routes/index.js')
const {
    auth
} = require('../utilz/jwt')

module.exports = (app) => {
    app.use('/', routers.home)
    app.use('/home', routers.home)
    app.use('/user', routers.user)
    app.use('/expenses', routers.expenses)

    app.use('*', auth(false), (req, res) => {
        return res.render('404.hbs', {
            title: 'Page Not Found',
            isLoggedIn: req.isLoggedIn,
            username: req.username
        })

    })
}