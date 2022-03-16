const { Router } = require('express');
const { check } = require('express-validator');
const { questionsController } = require('../controllers/questions.controller');
const { commentsController } = require('../controllers/comments.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/deleted', authMiddleware, questionsController.getRemovedQuestions);

router.get('/:id?', questionsController.getQuestions);
router.post(
  '/',
  authMiddleware,
  [
    check(
      'question',
      'Длина текста должна быть больше 10 и меньше 140 символов'
    ).isLength({ min: 10, max: 140 }),
  ],
  questionsController.addQuestion
);

router.post(
  '/:questionId/rate',
  authMiddleware,
  questionsController.changeRate
);

router.post(
  '/:questionId/comments/:commentId/rate',
  authMiddleware,
  questionsController.changeRate
);

router.get('/:id/comments', commentsController.getCommentsByQuestionId);

router.post(
  '/:id/comments',
  authMiddleware,
  commentsController.addCommentToPost
);

router.delete('/:id', authMiddleware, questionsController.removeQuestion);

router.patch('/:id', authMiddleware, questionsController.restoreQuestion);

module.exports = router;
