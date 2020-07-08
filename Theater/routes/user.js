const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    userValidator
} = require('../utilz/validator')
const {
    auth
} = require('../utilz/jwt')

router.get('/register', controllers.user.get.register);
router.get('/login', controllers.user.get.login);
router.get('/logout', auth(true), controllers.user.get.logout)

router.post('/register', userValidator, controllers.user.post.register);
router.post('/login', controllers.user.post.login);

module.exports = router;