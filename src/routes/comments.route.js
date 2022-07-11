const { Router } = require('express');
const {
  getCommentsByQuestionIdController,
  addNewCommentController,
  deleteCommentController,
} = require('../controllers/comments.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router({ mergeParams: true });

router.get('/', getCommentsByQuestionIdController);
router.post('/', authMiddleware, addNewCommentController);
router.delete('/:id', authMiddleware, deleteCommentController);

module.exports = router;
