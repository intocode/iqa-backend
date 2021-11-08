const { Router } = require('express');

const router = Router();

router.use('/questions', require('./questions.route'));
router.use('/auth', require('./auth.route'));
router.use('/user', require('./user.route'));
router.use('/tags', require('./tags.route'));

module.exports = router;
