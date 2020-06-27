const router = require('express').Router();
const controllers = require('../controllers/index');
const {
    auth
} = require('../utilz/jwt');

const {
    expenseValidator
} = require('../utilz/validator')

router.get('/all', auth(true), controllers.expenses.get.all);

router.get('/create', auth(true), controllers.expenses.get.create);
router.post('/create', auth(true), expenseValidator, controllers.expenses.post.create); //Add validator

router.get('/report/:id', auth(true), controllers.expenses.get.details);

router.get('/delete/:id', auth(true), controllers.expenses.get.delete);
// router.get('/enroll/:id', auth(true), controllers.expenses.post.enroll);

module.exports = router;