const { Router } = require('express');
const {
  addNewLikeController,
  deleteLikeController,
} = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, addNewLikeController);
router.delete('/:id', authMiddleware, deleteLikeController);

module.exports = router;
