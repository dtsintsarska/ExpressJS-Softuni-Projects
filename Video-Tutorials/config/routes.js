const routers = require('../routes/index')
const router = require('../routes/user')

module.exports = (app) => {
    app.use('/', routers.home)
    app.use('/home', routers.home)
    app.use('/user', routers.user)
    app.use('/course', routers.course)

    app.use('*', (req, res, next) => {
        res.send('<h1> No page found </h1>')
    })
}