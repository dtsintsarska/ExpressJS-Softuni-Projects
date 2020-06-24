const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    auth
} = require('../utilz/jwt');

const {
    courseValidator
} = require('../utilz/validator')


router.get('/create', auth(true), controllers.course.get.create);
router.post('/create', auth(true), courseValidator, controllers.course.post.create);

router.get('/details/:id', auth(true), controllers.course.get.details);
router.get('/edit/:id', auth(true), controllers.course.get.edit)

router.post('/edit/:id', auth(true), courseValidator, controllers.course.post.edit)

router.get('/delete/:id', auth(true), controllers.course.get.delete);

router.get('/enroll/:id', auth(true), controllers.course.post.enroll);

module.exports = router;