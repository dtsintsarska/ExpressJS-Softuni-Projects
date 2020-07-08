const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    auth
} = require('../utilz/jwt');

const {
    playValidator
} = require('../utilz/validator')

router.get('/all', auth(true), controllers.play.get.all);
router.get('/sortByDate', auth(true), controllers.play.get.sortByDate);
router.get('/sortByLikes', auth(true), controllers.play.get.sortByLikes);

router.get('/create', auth(true), controllers.play.get.create);
router.post('/create', auth(true), playValidator, controllers.play.post.create);

router.get('/details/:id', auth(true), controllers.play.get.details);

router.get('/edit/:id', auth(true), controllers.play.get.edit);
router.post('/edit/:id', auth(true), playValidator, controllers.play.post.edit);

router.get('/delete/:id', auth(true), controllers.play.get.delete);

router.get('/like/:id', auth(true), controllers.play.post.like);

module.exports = router;