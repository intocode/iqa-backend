const { Router } = require('express');
const { check } = require('express-validator');
const { questionsController } = require('../controllers/questions.controller');
const { commentsController } = require('../controllers/comments.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const Question = require('../models/Question.model');
const Comment = require('../models/Comment.model');

const router = Router();

router.get('/recount', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find();

    comments.forEach(async (comment, i) => {
      await Question.findByIdAndUpdate(comment.questionId, {
        commentsCount: i + 1,
      });
    });
    return res.json('updated');
  } catch (e) {
    return res.status(401).json({ error: e.toString() });
  }
});

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

router.post('/:questionId/rate', authMiddleware, async (req, res) => {
  const { volume } = req.body;
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        error: 'Вопрос с таким ID не найден',
      });
    }

    let updated = false;
    question.rates.forEach((rate, index) => {
      if (rate.user.toString() === req.user.userId) {
        if (rate.volume !== volume) {
          // eslint-disable-next-line no-param-reassign
          rate.volume = volume;
        } else {
          question.rates.splice(index, 1);
        }

        updated = true;
      }
    });

    if (!updated) {
      question.rates.push({
        user: req.user.userId,
        volume,
      });
    }

    await question.save();

    return res.json(question.rates);
  } catch (e) {
    return res.status(401).json({
      error: e.toString(),
    });
  }
});

router.get('/:id/comments', commentsController.getCommentsByQuestionId);

router.post(
  '/:id/comments',
  authMiddleware,
  commentsController.addCommentToPost
);

router.delete(
  '/:id/delete',
  authMiddleware,
  questionsController.removeQuestion
);

router.patch(
  '/:id/restore',
  authMiddleware,
  questionsController.restoreQuestion
);

module.exports = router;
