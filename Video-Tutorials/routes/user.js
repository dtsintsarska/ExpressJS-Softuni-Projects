const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    userValidator
} = require('../utilz/validator')

router.get('/register', controllers.user.get.register);
router.get('/login', controllers.user.get.login);
router.get('/logout', controllers.user.get.logout)

router.post('/register', userValidator, controllers.user.post.register);
router.post('/login', controllers.user.post.login);

//router.post('/', controllers.home.post.search);

module.exports = router;