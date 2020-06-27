const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    auth
} = require('../utilz/jwt');

const {
    tripValidator
} = require('../utilz/validator')

router.get('/all', auth(true), controllers.tripp.get.all);

router.get('/create', auth(true), controllers.tripp.get.create);
router.post('/create', auth(true), tripValidator, controllers.tripp.post.create);

router.get('/details/:id', auth(true), controllers.tripp.get.details);

router.get('/delete/:id', auth(true), controllers.tripp.get.delete);
router.get('/enroll/:id', auth(true), controllers.tripp.post.enroll);

module.exports = router;