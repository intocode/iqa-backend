const { Router } = require('express');
const { commentsController } = require('../controllers/comments.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post(
  '/add/question/:id',
  authMiddleware,
  commentsController.addCommentToPost
);

module.exports = router;
