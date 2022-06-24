const { Router } = require('express');
const {
  getQuestionsController,
  addQuestionController,
  getQuestionByIdController,
  deleteQuestionController,
  restoreQuestionController,
  addQuestionToFavoritesController,
  removeQuestionFromFavoritesController,
} = require('../controllers/questions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/:_id', getQuestionByIdController);
router.get('/', getQuestionsController);
router.post('/', authMiddleware, addQuestionController);
router.delete('/:id', authMiddleware, deleteQuestionController);
router.patch('/:id/restore', authMiddleware, restoreQuestionController);

/* ИЗБРАННОЕ */
router.post('/:id/favorites', authMiddleware, addQuestionToFavoritesController);
router.delete('/:id/favorites', authMiddleware, removeQuestionFromFavoritesController);

module.exports = router;
