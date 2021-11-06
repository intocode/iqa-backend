const { Router } = require('express');

const router = Router();

router.use('/questions', require('./questions.route'));
router.use('/auth', require('./auth.route'));
router.use('/user', require('./user.route'));

module.exports = router;
