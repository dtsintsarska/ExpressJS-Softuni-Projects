const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    auth
} = require('../utilz/jwt')

router.get('/', auth(false), controllers.home.get.home);
router.post('/home', auth(false), controllers.home.post.search)


module.exports = router;