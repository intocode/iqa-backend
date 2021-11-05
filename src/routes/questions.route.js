const { Router } = require('express');
const { questionsController } = require('../controllers/questions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', authMiddleware, questionsController.addQuestion);

module.exports = router;
