const routers = require('../routes/index.js')
const {
    auth
} = require('../utilz/jwt')

module.exports = (app) => {
    app.use('/', routers.home)
    app.use('/home', routers.home)
    app.use('/user', routers.user)
    app.use('/play', routers.play)

    app.use('*', auth(false), (req, res) => {
        return res.send('<h1> Page Not Found </h1>') //{
        // title: 'Page Not Found',
        // isLoggedIn: req.isLoggedIn,
        // username: req.username
        //})

    })
}