const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    auth
} = require('../utilz/jwt')

router.get('/', auth(false), controllers.home.get.home);


module.exports = router;