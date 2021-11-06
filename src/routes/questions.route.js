const { Router } = require('express');
const { check } = require('express-validator');
const { questionsController } = require('../controllers/questions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post(
  '/',
  [
    check(
      'question',
      'Длина текста должна быть больше 4 и меньше 140 символов'
    ).isLength({ min: 4, max: 140 }),
  ],
  authMiddleware,
  questionsController.addQuestion
);

module.exports = router;
