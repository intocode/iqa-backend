const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => res.json('hi!'));

router.use('/questions', require('./questions.route'));
router.use('/auth', require('./auth.route'));
router.use('/user', require('./user.route'));
router.use('/tags', require('./tags.route'));
router.use('/comment', require('./comments.route'))

module.exports = router;
