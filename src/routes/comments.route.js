const { Router } = require('express');
const {
  getCommentsByQuestionIdController,
  addNewCommentController,
} = require('../controllers/comments.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router({ mergeParams: true });

router.get('/', getCommentsByQuestionIdController);
router.post('/', authMiddleware, addNewCommentController);

module.exports = router;
